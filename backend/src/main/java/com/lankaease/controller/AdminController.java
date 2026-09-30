package com.lankaease.controller;

import com.lankaease.dto.request.RegisterCustomerRequest;
import com.lankaease.dto.response.AdminDashboardStats;
import com.lankaease.dto.response.ProviderResponseDto;
import com.lankaease.dto.response.ServiceCategoryResponseDto;
import com.lankaease.dto.response.UserResponseDto;
import com.lankaease.entity.enums.VerificationStatus;
import com.lankaease.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStats> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponseDto> createUser(@RequestBody RegisterCustomerRequest request) {
        return ResponseEntity.ok(adminService.createUser(request));
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Long userId,
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(adminService.updateUser(userId, fullName, phone, role));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/providers/{providerId}/verify")
    public ResponseEntity<ProviderResponseDto> verifyProvider(
            @PathVariable Long providerId,
            @RequestParam VerificationStatus status,
            @RequestParam(required = false) String adminNotes) {
        return ResponseEntity.ok(adminService.verifyProvider(providerId, status, adminNotes));
    }

    @DeleteMapping("/providers/{providerId}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long providerId) {
        adminService.deleteProvider(providerId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/categories")
    public ResponseEntity<ServiceCategoryResponseDto> createCategory(
            @RequestParam String name,
            @RequestParam(required = false) String slug,
            @RequestParam String description,
            @RequestParam(required = false) String iconName) {
        return ResponseEntity.ok(adminService.createCategory(name, slug, description, iconName));
    }

    @PutMapping("/categories/{categoryId}")
    public ResponseEntity<ServiceCategoryResponseDto> updateCategory(
            @PathVariable Long categoryId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String iconName,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(adminService.updateCategory(categoryId, name, description, iconName, isActive));
    }

    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        adminService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }
}

