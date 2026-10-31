package com.lankaease.config;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.boot.SpringApplication;
import org.springframework.core.env.StandardEnvironment;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.*;

/** Explicit opt-in, read-only connectivity check. Never starts JPA or Flyway. */
@EnabledIfEnvironmentVariable(named = "RUN_SUPABASE_CONNECTION_CHECK", matches = "true")
class SupabaseConnectionTest {
    @Test void connectsUsingVerifiedTlsWithoutChangingTables() {
        var env = new StandardEnvironment();
        env.setActiveProfiles("prod");
        new DatabaseUrlEnvironmentPostProcessor().postProcessEnvironment(env, new SpringApplication());
        var properties = new Properties();
        properties.setProperty("user", env.getRequiredProperty("DB_USERNAME"));
        properties.setProperty("password", env.getRequiredProperty("DB_PASSWORD"));
        properties.setProperty("sslmode", "verify-full");
        properties.setProperty("sslrootcert", env.getRequiredProperty("DB_SSL_ROOT_CERT"));
        properties.setProperty("connectTimeout", "15");
        properties.setProperty("socketTimeout", "15");
        try (var connection = DriverManager.getConnection(env.getRequiredProperty("spring.datasource.url"), properties)) {
            connection.setReadOnly(true);
            try (var statement = connection.createStatement(); var result = statement.executeQuery(
                    "SELECT 1, ssl FROM pg_stat_ssl WHERE pid = pg_backend_pid()")) {
                assertTrue(result.next(), "No SSL session information returned");
                assertEquals(1, result.getInt(1));
                assertTrue(result.getBoolean(2), "The database connection must use TLS");
            }
        } catch (SQLException error) {
            // Driver messages can contain usernames/hosts. Report only the diagnostic class.
            fail("Supabase connection failed (SQLSTATE " + error.getSQLState()
                    + "). Check credentials, CA certificate, pooler host/port and network access; see SUPABASE_SETUP.md.");
        }
    }
}
