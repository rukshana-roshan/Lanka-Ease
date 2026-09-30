package com.lankaease.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record RegisterProviderRequest(
    @NotBlank(message = "Full name is required")
    String fullName,

    String businessName,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,

    @NotBlank(message = "Phone number is required")
    String phone,

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    String password,

    String description,
    Integer experienceYears,
    List<Long> categoryIds,
    List<String> serviceCities
) {}
