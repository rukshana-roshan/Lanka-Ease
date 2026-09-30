package com.lankaease.service;

import com.lankaease.dto.request.RegisterCustomerRequest;
import com.lankaease.dto.response.AdminDashboardStats;
import com.lankaease.dto.response.ProviderResponseDto;
import com.lankaease.dto.response.ServiceCategoryResponseDto;
import com.lankaease.dto.response.UserResponseDto;
import com.lankaease.entity.enums.VerificationStatus;

import java.util.List;

public interface AdminService {
    AdminDashboardStats getDashboardStats();
    List<UserResponseDto> getAllUsers();
    UserResponseDto createUser(RegisterCustomerRequest request);
    UserResponseDto updateUser(Long userId, String fullName, String phone, String role);
    void deleteUser(Long userId);
    ProviderResponseDto verifyProvider(Long providerId, VerificationStatus status, String adminNotes);
    void deleteProvider(Long providerId);
    ServiceCategoryResponseDto createCategory(String name, String slug, String description, String iconName);
    ServiceCategoryResponseDto updateCategory(Long categoryId, String name, String description, String iconName, Boolean isActive);
    void deleteCategory(Long categoryId);
}

