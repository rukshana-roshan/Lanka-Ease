package com.lankaease.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.net.URI;
import java.net.http.*;
import java.time.Duration;
import java.util.Map;

@Component
public class PasswordResetEmailSender {
    private final String apiKey;
    private final String from;
    private final ObjectMapper json;
    private final HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

    public PasswordResetEmailSender(@Value("${PASSWORD_RESET_RESEND_API_KEY:}") String apiKey,
            @Value("${PASSWORD_RESET_FROM:}") String from, ObjectMapper json) {
        this.apiKey = apiKey; this.from = from; this.json = json;
    }

    public boolean isConfigured() { return !apiKey.isBlank() && !from.isBlank(); }

    public void send(String email, String link) {
        try {
            String body = json.writeValueAsString(Map.of("from", from, "to", new String[]{email},
                "subject", "Reset your LankaEase password",
                "text", "Use this link to choose a new password:\n\n" + link
                    + "\n\nThis link expires in 15 minutes and can be used once. If you did not request it, ignore this email."));
            var response = client.send(HttpRequest.newBuilder(URI.create("https://api.resend.com/emails"))
                .timeout(Duration.ofSeconds(15)).header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(body)).build(),
                HttpResponse.BodyHandlers.discarding());
            if (response.statusCode() < 200 || response.statusCode() >= 300) throw new IllegalStateException("Email delivery failed");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); throw new IllegalStateException("Email delivery interrupted");
        } catch (Exception e) { throw new IllegalStateException("Email delivery failed"); }
    }
}
