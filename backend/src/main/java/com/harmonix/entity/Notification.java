package com.harmonix.entity;

import com.harmonix.constant.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    @Indexed
    private String userId;
    
    private NotificationType type;
    private String title;
    private String message;
    
    // Reference to related entity
    private String relatedEntityId;
    private String relatedEntityType; // e.g., "JobPost", "Application", "Message"
    
    // Action URL for frontend navigation
    private String actionUrl;
    
    @Builder.Default
    private boolean read = false;
    
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
    
    // Priority
    @Builder.Default
    private boolean highPriority = false;
}
