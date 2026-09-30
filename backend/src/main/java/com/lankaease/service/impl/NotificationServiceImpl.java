package com.lankaease.service.impl;

import com.lankaease.dto.response.NotificationResponseDto;
import com.lankaease.entity.Notification;
import com.lankaease.exception.ResourceNotFoundException;
import com.lankaease.repository.NotificationRepository;
import com.lankaease.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public List<NotificationResponseDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        if (notification.getUser().getId().equals(userId)) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    private NotificationResponseDto mapToDto(Notification n) {
        return new NotificationResponseDto(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getType(),
                n.getIsRead(),
                n.getReferenceId(),
                n.getCreatedAt()
        );
    }
}
