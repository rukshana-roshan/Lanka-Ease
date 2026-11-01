package com.lankaease.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class ProductionConfigurationTest {
    @Test void productionLoadsVerifiedTlsAndSchemaValidationWithoutDevelopmentFallbacks() {
        var env = new StandardEnvironment();
        env.getPropertySources().addFirst(new MapPropertySource("testProductionInputs", Map.of(
                "spring.profiles.active", "prod",
                "DATABASE_URL", "jdbc:postgresql://pooler.example.com:5432/postgres",
                "DB_USERNAME", "postgres.test", "DB_PASSWORD", "test-only",
                "DB_SSL_ROOT_CERT", "pom.xml", "JWT_SECRET", "test-only-key-at-least-thirty-two-characters",
                "CORS_ALLOWED_ORIGINS", "https://lanka-ease.netlify.app")));
        ConfigDataEnvironmentPostProcessor.applyTo(env);
        new DatabaseUrlEnvironmentPostProcessor().postProcessEnvironment(env, null);
        assertEquals("org.postgresql.Driver", env.getProperty("spring.datasource.driver-class-name"));
        assertEquals("validate", env.getProperty("spring.jpa.hibernate.ddl-auto"));
        assertEquals("verify-full", env.getProperty("spring.datasource.hikari.data-source-properties.sslmode"));
        assertEquals("false", env.getProperty("spring.flyway.enabled"));
        assertEquals("https://lanka-ease.netlify.app", env.getProperty("lankaease.cors.allowed-origins"));
        assertEquals("false", env.getProperty("lankaease.payment.mock-enabled"));
    }
}
