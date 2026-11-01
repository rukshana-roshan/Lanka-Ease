package com.lankaease.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/** Verifies repository DDL matches JPA mappings on H2; not a PostgreSQL compatibility proof. */
@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:schemaValidation;DB_CLOSE_DELAY=-1;MODE=PostgreSQL",
        "spring.sql.init.mode=always",
        "spring.sql.init.schema-locations=file:db/production-bootstrap.sql,classpath:db/marketplace/V4__provider_marketplace.sql",
        "spring.jpa.hibernate.ddl-auto=validate"
})
@ActiveProfiles("test")
class SchemaValidationTest {
    @Test void schemaScriptsSatisfyHibernateValidation() { }
}
