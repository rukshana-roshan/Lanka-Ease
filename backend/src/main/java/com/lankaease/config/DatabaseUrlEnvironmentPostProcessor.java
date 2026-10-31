package com.lankaease.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/** Converts PostgreSQL URLs without logging connection strings or credentials. */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {
    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        // H2 tests use create-drop. Never let a developer's real DATABASE_URL override them.
        if (Arrays.asList(environment.getActiveProfiles()).contains("test")) return;
        boolean production = Arrays.asList(environment.getProperty("SPRING_PROFILES_ACTIVE", "").split(",")).contains("prod")
                || Arrays.asList(environment.getActiveProfiles()).contains("prod");
        String dbUrl = environment.getProperty("DATABASE_URL");
        if (dbUrl == null || dbUrl.isBlank()) dbUrl = environment.getProperty("DATABASE_PRIVATE_URL");
        if (dbUrl == null || dbUrl.isBlank()) dbUrl = environment.getProperty("DATABASE_PUBLIC_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            if (production) throw invalidConfiguration();
            return;
        }
        if (!production && dbUrl.startsWith("jdbc:h2:")) return;
        Map<String, Object> props = new HashMap<>();
        try {
            String normalized = dbUrl.trim();
            if (normalized.startsWith("jdbc:")) normalized = normalized.substring(5);
            if (normalized.startsWith("postgres://")) normalized = "postgresql://" + normalized.substring(11);
            URI uri = URI.create(normalized);
            if (!"postgresql".equals(uri.getScheme()) || uri.getHost() == null
                    || uri.getPath() == null || uri.getPath().length() < 2 || uri.getFragment() != null) {
                throw invalidConfiguration();
            }
            String userInfo = uri.getRawUserInfo();
            if (production && userInfo != null) throw invalidConfiguration();
            if (userInfo != null) {
                String[] credentials = userInfo.split(":", 2);
                props.put("spring.datasource.username", decode(credentials[0]));
                if (credentials.length == 2) props.put("spring.datasource.password", decode(credentials[1]));
            }
            String query = uri.getRawQuery();
            if (production && query != null) {
                for (String part : query.split("&")) {
                    String[] parameter = part.split("=", 2);
                    String key = decode(parameter[0]).toLowerCase(java.util.Locale.ROOT);
                    if (key.equals("user") || key.equals("password") || key.equals("ssl")
                            || key.equals("sslfactory") || key.equals("sslhostnameverifier")
                            || key.equals("sslrootcert")
                            || (key.equals("sslmode") && (parameter.length != 2 || !decode(parameter[1]).equals("verify-full")))) {
                        throw invalidConfiguration();
                    }
                }
            }
            int port = uri.getPort() < 0 ? 5432 : uri.getPort();
            props.put("spring.datasource.url", "jdbc:postgresql://" + uri.getHost() + ":" + port
                    + uri.getRawPath() + (query == null ? "" : "?" + query));
            if (environment.containsProperty("DB_USERNAME")) props.put("spring.datasource.username", environment.getProperty("DB_USERNAME"));
            if (environment.containsProperty("DB_PASSWORD")) props.put("spring.datasource.password", environment.getProperty("DB_PASSWORD"));
        } catch (RuntimeException ignored) {
            // URI parser exceptions may contain credentials. Do not attach them.
            throw invalidConfiguration();
        }
        environment.getPropertySources().addFirst(new MapPropertySource("databaseUrlProperties", props));
    }

    private static String decode(String value) {
        return URLDecoder.decode(value.replace("+", "%2B"), StandardCharsets.UTF_8);
    }

    private static IllegalArgumentException invalidConfiguration() {
        return new IllegalArgumentException("Invalid database configuration. Use a PostgreSQL URL without embedded credentials in prod; set DB_USERNAME, DB_PASSWORD and DB_SSL_ROOT_CERT separately. TLS must use verify-full.");
    }
}
