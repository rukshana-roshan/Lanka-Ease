package com.lankaease.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping(value = {"/", "/api", "/health"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> rootHealth() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("service", "LankaEase Backend API");
        response.put("version", "1.0.0");
        response.put("message", "LankaEase Sri Lankan Local Services Platform API is running smoothly.");
        response.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(response);
    }
}
