package com.lankaease.controller;

import com.lankaease.entity.ContactMessage;
import com.lankaease.repository.ContactMessageRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.lankaease.exception.BadRequestException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/contact-messages")
@PreAuthorize("hasRole('ADMIN')")
public class ContactInboxController {
    private final ContactMessageRepository repository;
    public ContactInboxController(ContactMessageRepository repository) { this.repository = repository; }

    public record Message(Long id, String name, String email, String phone, String subject,
                          String message, LocalDateTime createdAt) {
        static Message from(ContactMessage value) {
            return new Message(value.getId(), value.getName(), value.getEmail(), value.getPhone(),
                    value.getSubject(), value.getMessage(), value.getCreatedAt());
        }
    }
    public record Inbox(List<Message> content, int page, int totalPages, long totalElements) {}

    @GetMapping
    public Inbox list(@RequestParam(defaultValue = "0") int page,
                      @RequestParam(defaultValue = "20") int size) {
        if (page < 0 || size < 1 || size > 50) {
            throw new BadRequestException("Use a nonnegative page and size between 1 and 50");
        }
        var results = repository.findAll(PageRequest.of(page, size,
                Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id"))));
        return new Inbox(results.stream().map(Message::from).toList(), page,
                results.getTotalPages(), results.getTotalElements());
    }
}
