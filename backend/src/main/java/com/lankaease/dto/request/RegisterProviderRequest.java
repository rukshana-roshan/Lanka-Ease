package com.lankaease.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record RegisterProviderRequest(
    @NotBlank(message = "Full name is required")
    @Size(max=100) String fullName,

    @Size(max=150) String businessName,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max=150) String email,

    @NotBlank(message = "Phone number is required")
    @Size(max=20) String phone,

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    String password,

    @Size(max=5000) String description,
    @jakarta.validation.constraints.Min(0) @jakarta.validation.constraints.Max(80) Integer experienceYears,
    @Size(max=30) List<@jakarta.validation.constraints.NotNull Long> categoryIds,
    @Size(max=50) List<@NotBlank @Size(max=100) String> serviceCities
) {}
