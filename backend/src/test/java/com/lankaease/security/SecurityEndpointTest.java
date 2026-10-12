package com.lankaease.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
public class SecurityEndpointTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testPublicRootAndHealthEndpoints() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));

        mockMvc.perform(get("/api"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));

        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));

        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }

    @Test
    public void testPublicCatalogAndTrackingEndpoints() throws Exception {
        // Public service categories
        mockMvc.perform(get("/api/services"))
                .andExpect(status().isOk());

        // Public providers
        mockMvc.perform(get("/api/providers"))
                .andExpect(status().isOk());

        // Public contact form
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test Visitor\",\"email\":\"visitor@example.com\",\"message\":\"Inquiry\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"));

        // Public request tracking by ID should NOT return 401 Unauthorized
        mockMvc.perform(get("/api/requests/1"))
                .andExpect(status().is(not(401)));

        // Public request tracking by Code should NOT return 401 Unauthorized
        mockMvc.perform(get("/api/requests/code/REQ-2026-001"))
                .andExpect(status().is(not(401)));

        // Public reviews by provider
        mockMvc.perform(get("/api/reviews/provider/1"))
                .andExpect(status().isOk());

        // Public payment webhook
        mockMvc.perform(post("/api/payments/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"order_id\":\"PAY-123\",\"status\":\"COMPLETED\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void testCustomerRegistrationLoginAndProtectedAccess() throws Exception {
        String uniqueEmail = "customer_" + System.currentTimeMillis() + "@test.com";
        String uniquePhone = "+9477" + (int)(1000000 + Math.random() * 9000000);

        // 1. Customer registration must be publicly accessible
        Map<String, Object> registerPayload = Map.of(
                "fullName", "Kamal Test",
                "email", uniqueEmail,
                "phone", uniquePhone,
                "password", "password123",
                "defaultAddress", "Colombo 07"
        );

        MvcResult regResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.user.email").value(uniqueEmail))
                .andExpect(jsonPath("$.user.role").value("CUSTOMER"))
                .andReturn();

        JsonNode regNode = objectMapper.readTree(regResult.getResponse().getContentAsString());
        String regToken = regNode.get("token").asText();
        assertNotNull(regToken);

        // 2. Login with registered credentials must be publicly accessible and succeed
        Map<String, Object> loginPayload = Map.of(
                "email", uniqueEmail,
                "password", "password123"
        );

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value(uniqueEmail))
                .andReturn();

        JsonNode loginNode = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String authToken = loginNode.get("token").asText();

        // 3. Customer can access protected customer endpoints using the JWT bearer token
        mockMvc.perform(get("/api/family")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/notifications")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/conversations")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk());

        // 4. Customer cannot access admin endpoints (403 Forbidden, role restriction enforced)
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testProtectedEndpointsWithoutTokenReturnUnauthorized() throws Exception {
        // Without authentication header, access must be 401 UNAUTHORIZED
        mockMvc.perform(get("/api/family"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));

        mockMvc.perform(get("/api/notifications"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/conversations"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }
}
