package com.lankaease.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.core.io.support.SpringFactoriesLoader;
import org.springframework.boot.env.EnvironmentPostProcessor;

import static org.junit.jupiter.api.Assertions.*;

class DatabaseUrlEnvironmentPostProcessorTest {
    @Test void processorIsRegisteredForSpringBootStartup() {
        assertTrue(SpringFactoriesLoader.loadFactoryNames(EnvironmentPostProcessor.class,
                getClass().getClassLoader()).contains(DatabaseUrlEnvironmentPostProcessor.class.getName()));
    }
    private void process(MockEnvironment env) {
        new DatabaseUrlEnvironmentPostProcessor().postProcessEnvironment(env, new SpringApplication());
    }

    private MockEnvironment production(String url) {
        return new MockEnvironment().withProperty("SPRING_PROFILES_ACTIVE", "prod")
                .withProperty("DATABASE_URL", url).withProperty("DB_USERNAME", "pool-user")
                .withProperty("DB_PASSWORD", "test-only-password")
                .withProperty("DB_SSL_ROOT_CERT", "pom.xml");
    }

    @Test void jdbcUrlUsesSeparateCredentials() {
        var env = production("jdbc:postgresql://pooler.example.com:5432/postgres");
        process(env);
        assertEquals("jdbc:postgresql://pooler.example.com:5432/postgres", env.getProperty("spring.datasource.url"));
        assertEquals("pool-user", env.getProperty("spring.datasource.username"));
        assertEquals("test-only-password", env.getProperty("spring.datasource.password"));
    }

    @Test void supportsPostgresSchemeAndDefaultPort() {
        var env = production("postgres://pooler.example.com/postgres?sslmode=verify-full");
        process(env);
        assertEquals("jdbc:postgresql://pooler.example.com:5432/postgres?sslmode=verify-full", env.getProperty("spring.datasource.url"));
    }

    @Test void rejectsEmbeddedCredentialsWithoutLeakingThem() {
        var error = assertThrows(IllegalArgumentException.class,
                () -> process(production("postgresql://secret-user:secret-password@pooler.example.com/postgres")));
        assertFalse(error.toString().contains("secret-password"));
        assertNull(error.getCause());
    }

    @Test void rejectsUnsafeTlsAndQueryCredentials() {
        for (String query : new String[]{"sslmode=disable", "sslmode=require", "ssl=false",
                "user=secret", "password=secret", "sslfactory=unsafe", "sslhostnameverifier=unsafe", "sslrootcert=override"}) {
            assertThrows(IllegalArgumentException.class,
                    () -> process(production("jdbc:postgresql://pooler.example.com/postgres?" + query)));
        }
    }

    @Test void rejectsMalformedUrlWithoutLeakingInput() {
        var error = assertThrows(IllegalArgumentException.class, () -> process(production("invalid secret-password")));
        assertFalse(error.toString().contains("secret-password"));
    }

    @Test void productionRequiresDatabaseUrl() {
        assertThrows(IllegalArgumentException.class,
                () -> process(new MockEnvironment().withProperty("SPRING_PROFILES_ACTIVE", "prod")));
    }

    @Test void h2TestsIgnoreRealDatabaseEnvironmentEvenWithProductionSelected() {
        var env = production("jdbc:postgresql://pooler.example.com/postgres");
        env.setActiveProfiles("test");
        process(env);
        assertNull(env.getProperty("spring.datasource.url"));
    }

    @Test void productionRequiresSeparateCredentialsAndReadableCa() {
        for (String key : new String[]{"DB_USERNAME", "DB_PASSWORD", "DB_SSL_ROOT_CERT"}) {
            var env = production("jdbc:postgresql://pooler.example.com/postgres").withProperty(key, "");
            assertThrows(IllegalArgumentException.class, () -> process(env));
        }
        var env = production("jdbc:postgresql://pooler.example.com/postgres")
                .withProperty("DB_SSL_ROOT_CERT", "missing-certificate.crt");
        assertThrows(IllegalArgumentException.class, () -> process(env));
    }

    @Test void productionEnforcesVerifiedTlsEvenWithConflictingEnvironment() {
        var env = production("jdbc:postgresql://pooler.example.com/postgres")
                .withProperty("spring.datasource.hikari.data-source-properties.sslmode", "disable");
        process(env);
        assertEquals("verify-full", env.getProperty("spring.datasource.hikari.data-source-properties.sslmode"));
        assertEquals("pom.xml", env.getProperty("spring.datasource.hikari.data-source-properties.sslrootcert"));
    }

    @Test void retainsH2DevelopmentSupport() {
        var env = new MockEnvironment().withProperty("DATABASE_URL", "jdbc:h2:mem:local");
        process(env);
        assertNull(env.getProperty("spring.datasource.url"));
    }

    @Test void legacyCredentialsAreDecodedAfterSplittingAndExplicitValuesWin() {
        var env = new MockEnvironment().withProperty("DATABASE_URL", "postgres://name%3Apart:p%40ss%2Bword@localhost/db");
        process(env);
        assertEquals("name:part", env.getProperty("spring.datasource.username"));
        assertEquals("p@ss+word", env.getProperty("spring.datasource.password"));
        env = new MockEnvironment().withProperty("DATABASE_URL", "postgres://legacy:legacy@localhost/db")
                .withProperty("DB_USERNAME", "explicit").withProperty("DB_PASSWORD", "explicit-password");
        process(env);
        assertEquals("explicit", env.getProperty("spring.datasource.username"));
        assertEquals("explicit-password", env.getProperty("spring.datasource.password"));
    }
}
