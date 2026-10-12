package com.lankaease.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitContactForm(@RequestBody(required = false) Map<String, Object> contactPayload) {
        logger.info("Received public contact message submission: {}", contactPayload);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Thank you for contacting LankaEase. Our support team will get back to you shortly.");
        return ResponseEntity.ok(response);
    }
}
