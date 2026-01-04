package com.harmonix.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationCreateRequest {
    private String jobPostId;
    private String coverLetter;
    private Double proposedRate;
    private String portfolioUrl;
}
