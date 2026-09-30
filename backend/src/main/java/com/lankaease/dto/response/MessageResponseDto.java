package com.lankaease.dto.response;

import java.time.LocalDateTime;

public record MessageResponseDto(
    Long id,
    Long conversationId,
    Long senderId,
    String senderName,
    String senderProfileImage,
    String textContent,
    String mediaUrl,
    Boolean isRead,
    LocalDateTime createdAt
) {}
