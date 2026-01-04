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
@Document(collection = "collaboration_requests")
public class CollaborationRequest {
    
    @Id
    private String id;
    
    private String creatorId;
    private String creatorEmail;
    private String title;
    private String description;
    
    private Instant createdAt;
    private Instant updatedAt;
}
