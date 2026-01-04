package com.harmonix.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollaborationRequestResponse {
    
    private String id;
    private String requesterId;
    private String jobPostId;
    private String message;
    private String status;
    private LocalDateTime createdAt;
}
