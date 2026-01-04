package com.harmonix.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobPostUpdateRequest {
    
    private String title;
    private String description;
    private String skillsNeeded;
    private String collaborationType;
    private String availability;
    private String contactMethod;
    private String imageUrl;
}
