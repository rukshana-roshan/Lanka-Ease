package com.lankaease.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lankaease.entity.User;
import com.lankaease.entity.enums.Role;
import com.lankaease.repository.UserRepository;
import com.lankaease.service.PasswordResetEmailSender;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class PasswordResetTest {
    @Autowired MockMvc mvc;
    @Autowired UserRepository users;
    @Autowired PasswordEncoder encoder;
    @Autowired ObjectMapper json;
    @MockBean PasswordResetEmailSender mail;

    User account() {
        return users.saveAndFlush(new User("Reset test", UUID.randomUUID()+"@example.com",
            UUID.randomUUID().toString().substring(0, 18), encoder.encode("old-password"), Role.CUSTOMER));
    }
    String send(User user) throws Exception {
        when(mail.isConfigured()).thenReturn(true);
        mvc.perform(post("/api/auth/forgot-password").contentType("application/json")
            .content(json.writeValueAsString(Map.of("email", user.getEmail().toUpperCase()))))
            .andExpect(status().isOk());
        var link = ArgumentCaptor.forClass(String.class);
        verify(mail).send(eq(user.getEmail()), link.capture());
        return link.getValue().split("#token=")[1];
    }
    void reset(String token, String password, int status) throws Exception {
        mvc.perform(post("/api/auth/reset-password").contentType("application/json")
            .content(json.writeValueAsString(Map.of("token", token, "password", password))))
            .andExpect(status().is(status));
    }
    @Test void resetChangesLoginAndCannotBeReused() throws Exception {
        User user = account(); String token = send(user);
        reset(token, "new-password", 200);
        assertTrue(encoder.matches("new-password", users.findById(user.getId()).orElseThrow().getPasswordHash()));
        reset(token, "another-password", 400);
        mvc.perform(post("/api/auth/login").contentType("application/json")
            .content(json.writeValueAsString(Map.of("email", user.getEmail(), "password", "old-password"))))
            .andExpect(status().isUnauthorized());
        mvc.perform(post("/api/auth/login").contentType("application/json")
            .content(json.writeValueAsString(Map.of("email", user.getEmail(), "password", "new-password"))))
            .andExpect(status().isOk()).andExpect(jsonPath("$.token").isNotEmpty());
    }
    @Test void rejectsTamperingAndWeakPasswords() throws Exception {
        User user = account(); String token = send(user);
        reset(token + "tampered", "new-password", 400);
        reset(token, "short", 400);
        assertTrue(encoder.matches("old-password", user.getPasswordHash()));
    }
    @Test void unknownAndDisabledAccountsHaveSameResponseAndNoEmail() throws Exception {
        when(mail.isConfigured()).thenReturn(true);
        User user = account(); user.setIsEnabled(false); users.saveAndFlush(user);
        for (String address : new String[]{user.getEmail(), "missing@example.com"}) {
            mvc.perform(post("/api/auth/forgot-password").contentType("application/json")
                .content(json.writeValueAsString(Map.of("email", address))))
                .andExpect(status().isOk()).andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("If an active account")));
        }
        verify(mail, never()).send(anyString(), anyString());
    }
    @Test void repeatedRequestsAreThrottled() throws Exception {
        User user = account(); send(user);
        mvc.perform(post("/api/auth/forgot-password").contentType("application/json")
            .content(json.writeValueAsString(Map.of("email", user.getEmail())))).andExpect(status().isOk());
        verify(mail, times(1)).send(anyString(), anyString());
    }
    @Test void expiredLinksAndDisabledAccountsCannotReset() throws Exception {
        User user = account();
        var mac = javax.crypto.Mac.getInstance("HmacSHA256");
        mac.init(io.jsonwebtoken.security.Keys.hmacShaKeyFor(
            "audit-test-only-signing-key-at-least-thirty-two-characters".getBytes(java.nio.charset.StandardCharsets.UTF_8)));
        var key = io.jsonwebtoken.security.Keys.hmacShaKeyFor(mac.doFinal(
            ("password-reset:" + user.getPasswordHash()).getBytes(java.nio.charset.StandardCharsets.UTF_8)));
        String expired = user.getId() + "." + io.jsonwebtoken.Jwts.builder().subject(user.getId().toString())
            .claim("purpose", "password-reset").expiration(new java.util.Date(System.currentTimeMillis()-60000))
            .signWith(key).compact();
        reset(expired, "new-password", 400);
        String token = send(user);
        user.setIsEnabled(false); users.saveAndFlush(user);
        reset(token, "new-password", 400);
    }
    @Test void unconfiguredSenderReportsUnavailable() throws Exception {
        mvc.perform(post("/api/auth/forgot-password").contentType("application/json")
            .content("{\"email\":\"someone@example.com\"}"))
            .andExpect(status().isServiceUnavailable());
    }
}
