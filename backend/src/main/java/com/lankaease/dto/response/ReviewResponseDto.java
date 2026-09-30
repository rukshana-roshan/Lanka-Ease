package com.lankaease.dto.response;

import java.time.LocalDateTime;

public record ReviewResponseDto(
    Long id,
    Long requestId,
    String requestCode,
    String customerName,
    String customerProfileImage,
    Long providerId,
    String providerBusinessName,
    Integer rating,
    String reviewText,
    String photoUrl,
    LocalDateTime createdAt
) {}
