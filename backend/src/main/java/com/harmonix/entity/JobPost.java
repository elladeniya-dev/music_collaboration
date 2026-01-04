package com.harmonix.entity;

import com.harmonix.constant.JobType;
import com.harmonix.constant.JobVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "job_posts")
public class JobPost {

    @Id
    private String id;

    @Indexed
    private String userId;
    
    private String title;
    private String description;
    
    // Legacy field - kept for backward compatibility
    private String skillsNeeded;
    
    // Structured skill requirements
    @Builder.Default
    private List<String> requiredSkills = new ArrayList<>();
    
    @Builder.Default
    private List<String> preferredSkills = new ArrayList<>();
    
    // Legacy field
    private String collaborationType;
    
    // Structured job type
    @Builder.Default
    private JobType jobType = JobType.COLLABORATION;
    
    // Budget and compensation
    private String budgetRange; // e.g., "$500-$1000" or "Revenue share"
    private boolean isPaid;
    
    // Timeline
    private String availability;
    private LocalDateTime deadline;
    private String estimatedDuration; // e.g., "2 weeks", "3 months"
    
    // Media and contact
    private String imageUrl;
    private String contactMethod;
    
    // Genres and tags
    @Builder.Default
    private List<String> genres = new ArrayList<>();
    
    @Builder.Default
    private List<String> tags = new ArrayList<>();
    
    // Visibility and status
    @Builder.Default
    private JobVisibility visibility = JobVisibility.PUBLIC;
    
    @Builder.Default
    private boolean active = true;
    
    @Builder.Default
    private boolean closed = false;
    
    // Analytics
    @Builder.Default
    private int viewCount = 0;
    
    @Builder.Default
    private int applicationCount = 0;
    
    // Timestamps
    private LocalDateTime postedAt;
    private LocalDateTime updatedAt;
    private LocalDateTime closedAt;
}

