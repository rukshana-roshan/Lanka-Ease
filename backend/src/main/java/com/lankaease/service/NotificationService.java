package com.lankaease.service;

import com.lankaease.dto.response.NotificationResponseDto;
import java.util.List;

public interface NotificationService {
    List<NotificationResponseDto> getUserNotifications(Long userId);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
}
