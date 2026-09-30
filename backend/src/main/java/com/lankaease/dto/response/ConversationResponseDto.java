package com.lankaease.dto.response;

import java.time.LocalDateTime;

public record ConversationResponseDto(
    Long id,
    Long otherUserId,
    String otherUserName,
    String otherUserProfileImage,
    Long requestId,
    String requestCode,
    String lastMessage,
    LocalDateTime lastMessageTime,
    Long unreadCount
) {}
