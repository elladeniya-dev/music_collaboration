package com.harmonix.mapper;

import com.harmonix.dto.response.CollaborationRequestResponse;
import com.harmonix.entity.CollaborationRequest;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Component
public class CollaborationRequestMapper {

    public CollaborationRequestResponse toResponse(CollaborationRequest request) {
        if (request == null) {
            return null;
        }
        
        return CollaborationRequestResponse.builder()
                .id(request.getId())
                .requesterId(request.getCreatorId())
                .jobPostId(request.getTitle()) // Assuming title is being used as jobPostId
                .message(request.getDescription())
                .status("pending") // Default status
                .createdAt(request.getCreatedAt() != null 
                        ? LocalDateTime.ofInstant(request.getCreatedAt(), ZoneId.systemDefault())
                        : null)
                .build();
    }
}
