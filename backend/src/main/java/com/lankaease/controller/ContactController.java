package com.lankaease.controller;

import com.lankaease.entity.ContactMessage;
import com.lankaease.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final ContactMessageRepository repository;
    public ContactController(ContactMessageRepository repository) { this.repository = repository; }
    public record Submission(@NotBlank @Size(max=100) String name,
            @NotBlank @Email @Size(max=150) String email, @Size(max=30) String phone,
            @Size(max=150) String subject, @NotBlank @Size(max=10000) String message) {}
    @PostMapping
    public ResponseEntity<Map<String, Object>> submitContactForm(@Valid @RequestBody Submission body) {
        var message = repository.save(new ContactMessage(body.name(), body.email(), body.phone(), body.subject(), body.message()));
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "id", message.getId(), "message", "Your message has been received."));
    }
}
