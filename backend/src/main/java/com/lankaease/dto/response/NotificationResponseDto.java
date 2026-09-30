package com.lankaease.dto.response;

import java.time.LocalDateTime;

public record NotificationResponseDto(
    Long id,
    String title,
    String message,
    String type,
    Boolean isRead,
    String referenceId,
    LocalDateTime createdAt
) {}
