package com.lankaease.controller;

import com.lankaease.dto.request.LoginRequest;
import com.lankaease.dto.request.RegisterCustomerRequest;
import com.lankaease.dto.request.RegisterProviderRequest;
import com.lankaease.dto.response.JwtAuthResponse;
import com.lankaease.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<JwtAuthResponse> registerCustomer(@Valid @RequestBody RegisterCustomerRequest request) {
        return ResponseEntity.ok(authService.registerCustomer(request));
    }

    @PostMapping("/register/provider")
    public ResponseEntity<JwtAuthResponse> registerProvider(@Valid @RequestBody RegisterProviderRequest request) {
        return ResponseEntity.ok(authService.registerProvider(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtAuthResponse> refreshToken(@RequestParam String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }
}
