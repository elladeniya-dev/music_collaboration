package com.harmonix.dto.response;

import com.harmonix.constant.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private String id;
    private String jobPostId;
    private String jobPostTitle;
    private String applicantId;
    private String applicantName;
    private String postOwnerId;
    private String coverLetter;
    private Double proposedRate;
    private String portfolioUrl;
    private ApplicationStatus status;
    private String rejectionReason;
    private String notes;
    private String chatHeadId;
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime respondedAt;
    private LocalDateTime completedAt;
}
