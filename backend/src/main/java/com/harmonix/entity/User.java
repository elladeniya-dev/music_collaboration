package com.harmonix.entity;

import com.harmonix.constant.ExperienceLevel;
import com.harmonix.constant.UserRole;
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
@Document(collection = "users")
public class User {

    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String name;
    private String profileImage;
    
    // Legacy field - kept for backward compatibility
    private String userType;
    
    // Role-based access control
    @Builder.Default
    private UserRole role = UserRole.USER;
    
    // Rich musician profile
    @Builder.Default
    private List<String> instruments = new ArrayList<>();
    
    @Builder.Default
    private List<String> genres = new ArrayList<>();
    
    private String location;
    private String timezone;
    private ExperienceLevel experienceLevel;
    private String bio;
    
    // External links
    private String spotifyUrl;
    private String youtubeUrl;
    private String soundcloudUrl;
    private String instagramUrl;
    private String websiteUrl;
    
    // Account status
    @Builder.Default
    private boolean active = true;
    
    @Builder.Default
    private boolean suspended = false;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
}

