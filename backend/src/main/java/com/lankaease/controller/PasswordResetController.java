package com.lankaease.controller;

import com.lankaease.service.PasswordResetService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {
    private final PasswordResetService service;
    public PasswordResetController(PasswordResetService service) { this.service = service; }

    public record Forgot(@NotBlank @Email @Size(max=150) String email) {}
    public record Reset(@NotBlank @Size(max=2048) String token,
                        @NotBlank @Size(min=8, max=64) String password) {}

    @PostMapping("/forgot-password")
    public Map<String, String> forgot(@Valid @RequestBody Forgot body) {
        service.request(body.email());
        return Map.of("message", "If an active account matches that email, a password reset link will be sent. Check your inbox and spam folder.");
    }

    @PostMapping("/reset-password")
    public Map<String, String> reset(@Valid @RequestBody Reset body) {
        service.reset(body.token(), body.password());
        return Map.of("message", "Your password has been changed. Sign in with your new password.");
    }
}
