package com.lankaease.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * Automatically converts Railway/Heroku style DATABASE_URL (postgres:// or postgresql://)
 * into a Spring Boot compatible JDBC URL (jdbc:postgresql://...) and extracts credentials.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String dbUrl = environment.getProperty("DATABASE_URL");
        if (dbUrl == null || dbUrl.isEmpty()) {
            dbUrl = environment.getProperty("DATABASE_PRIVATE_URL");
        }
        if (dbUrl == null || dbUrl.isEmpty()) {
            dbUrl = environment.getProperty("DATABASE_PUBLIC_URL");
        }

        if (dbUrl == null || dbUrl.isEmpty() || dbUrl.startsWith("jdbc:h2:")) {
            return;
        }

        Map<String, Object> props = new HashMap<>();

        if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
            String cleanUriStr = dbUrl.startsWith("postgres://")
                    ? "http://" + dbUrl.substring("postgres://".length())
                    : "http://" + dbUrl.substring("postgresql://".length());

            try {
                URI uri = URI.create(cleanUriStr);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] credentials = userInfo.split(":", 2);
                    props.put("spring.datasource.username", credentials[0]);
                    props.put("spring.datasource.password", credentials[1]);
                }

                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();

                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                props.put("spring.datasource.url", jdbcUrl);
            } catch (Exception e) {
                String raw = dbUrl.startsWith("postgres://")
                        ? "jdbc:postgresql://" + dbUrl.substring("postgres://".length())
                        : "jdbc:postgresql://" + dbUrl.substring("postgresql://".length());
                props.put("spring.datasource.url", raw);
            }
        }

        if (!props.isEmpty()) {
            environment.getPropertySources().addFirst(new MapPropertySource("railwayDatabaseProperties", props));
        }
    }
}
