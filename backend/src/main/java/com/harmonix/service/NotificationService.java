package com.harmonix.service;

import com.harmonix.constant.NotificationType;
import com.harmonix.dto.response.NotificationResponse;
import com.harmonix.dto.response.PagedResponse;
import com.harmonix.entity.Notification;
import com.harmonix.exception.ResourceNotFoundException;
import com.harmonix.exception.UnauthorizedException;
import com.harmonix.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationResponse createNotification(String userId, NotificationType type, 
                                                   String title, String message, 
                                                   String relatedEntityId, 
                                                   String relatedEntityType, 
                                                   String actionUrl,
                                                   boolean highPriority) {
        
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .relatedEntityId(relatedEntityId)
                .relatedEntityType(relatedEntityType)
                .actionUrl(actionUrl)
                .highPriority(highPriority)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        Notification saved = notificationRepository.save(notification);
        log.info("Notification created for user {}: {}", userId, type);
        
        return mapToResponse(saved);
    }

    public PagedResponse<NotificationResponse> getUserNotifications(String userId, Pageable pageable) {
        Page<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return PagedResponse.of(notifications.map(this::mapToResponse));
    }

    public PagedResponse<NotificationResponse> getUnreadNotifications(String userId, Pageable pageable) {
        Page<Notification> notifications = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId, pageable);
        return PagedResponse.of(notifications.map(this::mapToResponse));
    }
    
    public PagedResponse<NotificationResponse> getNotificationsByType(String userId, NotificationType type, Pageable pageable) {
        Page<Notification> notifications = notificationRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId, type, pageable);
        return PagedResponse.of(notifications.map(this::mapToResponse));
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public NotificationResponse markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        // Verify ownership
        if (!notification.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only mark your own notifications as read");
        }
        
        if (!notification.isRead()) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notification = notificationRepository.save(notification);
            log.info("Notification {} marked as read", notificationId);
        }
        
        return mapToResponse(notification);
    }

    @Transactional
    public int markAllAsRead(String userId) {
        Page<Notification> unreadPage = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(
                userId, Pageable.unpaged());
        List<Notification> unread = unreadPage.getContent();
        
        unread.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        });
        
        notificationRepository.saveAll(unread);
        log.info("Marked {} notifications as read for user {}", unread.size(), userId);
        
        return unread.size();
    }

    @Transactional
    public int deleteReadNotifications(String userId) {
        int count = notificationRepository.deleteByUserIdAndReadTrue(userId);
        log.info("Deleted {} read notifications for user {}", count, userId);
        return count;
    }

    // System message helpers
    public void notifyJobPostClosed(String jobPostId, String jobTitle) {
        // Notify all applicants of this job post
        // This would require finding all applications for the job post
        // For now, just log it
        log.info("Job post {} closed: {}", jobPostId, jobTitle);
    }

    public void notifyCollaborationCompleted(String userId, String applicationId) {
        createNotification(
                userId,
                NotificationType.COLLABORATION_COMPLETED,
                "Collaboration Completed",
                "A collaboration has been marked as completed",
                applicationId,
                "Application",
                "/applications/" + applicationId,
                false
        );
    }
    
    /**
     * Map Notification entity to NotificationResponse DTO
     */
    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .relatedEntityId(notification.getRelatedEntityId())
                .relatedEntityType(notification.getRelatedEntityType())
                .actionUrl(notification.getActionUrl())
                .read(notification.isRead())
                .readAt(notification.getReadAt())
                .createdAt(notification.getCreatedAt())
                .highPriority(notification.isHighPriority())
                .build();
    }
}
