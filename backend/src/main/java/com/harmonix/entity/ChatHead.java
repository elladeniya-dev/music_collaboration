package com.harmonix.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_heads")
public class ChatHead {
    
    @Id
    private String id;

    private List<String> participants;
    private String lastMessage;
    private Instant lastUpdated;

    private String lastSenderId;
    private String lastMessageType;
    private boolean unread;
}
