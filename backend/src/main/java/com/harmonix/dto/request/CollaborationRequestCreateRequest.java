package com.harmonix.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollaborationRequestCreateRequest {
    
    @NotBlank(message = "Job post ID is required")
    private String jobPostId;
    
    @NotBlank(message = "Message is required")
    private String message;
}
