package com.harmonix.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class Message {
    
    @Id
    private String id;

    private String chatId;
    private String senderId;
    private String receiverId;

    private String message;
    private String type;
    private String mediaUrl;

    private String status;
    private Instant timestamp;
}
