package com.harmonix.entity;

import com.harmonix.constant.MessageStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class Message {
    
    @Id
    private String id;

    @Indexed
    private String chatId;
    
    @Indexed
    private String senderId;
    
    @Indexed
    private String receiverId;

    private String message;
    private String type; // text, image, audio, system
    private String mediaUrl;

    // Legacy status field - kept for backward compatibility
    private String status;
    
    // Enhanced status tracking
    @Builder.Default
    private MessageStatus messageStatus = MessageStatus.SENT;
    
    // System message indicator
    @Builder.Default
    private boolean isSystemMessage = false;
    
    // Soft delete
    @Builder.Default
    private boolean deleted = false;
    
    @Builder.Default
    private boolean deletedBySender = false;
    
    @Builder.Default
    private boolean deletedByReceiver = false;
    
    // Read tracking
    private LocalDateTime readAt;
    private LocalDateTime deliveredAt;
    
    private Instant timestamp;
}

