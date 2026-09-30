package com.lankaease.dto.response;

import com.lankaease.entity.enums.Role;
import java.time.LocalDateTime;

public record UserResponseDto(
    Long id,
    String fullName,
    String email,
    String phone,
    Role role,
    String preferredLanguage,
    String profileImage,
    Boolean isEmailVerified,
    LocalDateTime createdAt
) {}
