package com.harmonix.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "job_posts")
public class JobPost {

    @Id
    private String id;

    private String userId;
    private String title;
    private String description;
    private String skillsNeeded;
    private String collaborationType;
    private String availability;
    private String imageUrl;
    private String contactMethod;

    private LocalDateTime postedAt;
}
