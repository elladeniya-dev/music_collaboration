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
public class JobPostResponse {
    
    private String id;
    private String userId;
    private String title;
    private String description;
    private String skillsNeeded;
    private String collaborationType;
    private String availability;
    private String contactMethod;
    private String imageUrl;
    private LocalDateTime postedAt;
}
