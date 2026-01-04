package com.harmonix.controller;

import com.harmonix.constant.NotificationType;
import com.harmonix.dto.response.ApiResponse;
import com.harmonix.dto.response.NotificationResponse;
import com.harmonix.dto.response.PagedResponse;
import com.harmonix.security.CurrentUser;
import com.harmonix.security.UserPrincipal;
import com.harmonix.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    
    private final NotificationService notificationService;
    
    /**
     * Get user's notifications (paginated)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<NotificationResponse>>> getNotifications(
            @CurrentUser UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Boolean unreadOnly,
            @RequestParam(required = false) NotificationType type) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        PagedResponse<NotificationResponse> notifications;
        
        if (Boolean.TRUE.equals(unreadOnly)) {
            notifications = notificationService.getUnreadNotifications(currentUser.getId(), pageable);
        } else if (type != null) {
            notifications = notificationService.getNotificationsByType(currentUser.getId(), type, pageable);
        } else {
            notifications = notificationService.getUserNotifications(currentUser.getId(), pageable);
        }
        
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }
    
    /**
     * Get unread notification count
     */
    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @CurrentUser UserPrincipal currentUser) {
        
        long count = notificationService.getUnreadCount(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(count));
    }
    
    /**
     * Mark a notification as read
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable String id) {
        
        NotificationResponse notification = notificationService.markAsRead(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(notification));
    }
    
    /**
     * Mark all notifications as read
     */
    @PutMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<String>> markAllAsRead(
            @CurrentUser UserPrincipal currentUser) {
        
        int count = notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(
                String.format("Marked %d notifications as read", count)
        ));
    }
    
    /**
     * Delete read notifications (cleanup)
     */
    @DeleteMapping("/read")
    public ResponseEntity<ApiResponse<String>> deleteReadNotifications(
            @CurrentUser UserPrincipal currentUser) {
        
        int count = notificationService.deleteReadNotifications(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(
                String.format("Deleted %d read notifications", count)
        ));
    }
}
