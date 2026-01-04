package com.harmonix.entity;

import com.harmonix.constant.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "applications")
@CompoundIndexes({
    @CompoundIndex(name = "job_applicant_idx", def = "{'jobPostId': 1, 'applicantId': 1}", unique = true)
})
public class Application {

    @Id
    private String id;

    @Indexed
    private String jobPostId;
    
    @Indexed
    private String applicantId;
    
    @Indexed
    private String postOwnerId;
    
    // Application content
    private String coverLetter;
    private Double proposedRate;
    private String portfolioUrl;
    
    // Status tracking
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;
    
    private String rejectionReason;
    private String notes; // Private notes by post owner
    
    // Communication
    private String chatHeadId; // Link to chat conversation
    
    // Timestamps
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime respondedAt;
    private LocalDateTime completedAt;
}
