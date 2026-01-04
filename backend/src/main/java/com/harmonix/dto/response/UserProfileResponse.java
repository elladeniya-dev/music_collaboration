package com.harmonix.dto.response;

import com.harmonix.constant.ExperienceLevel;
import com.harmonix.constant.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    
    private String id;
    private String email;
    private String name;
    private String profileImage;
    private UserRole role;
    
    // Musician profile
    private List<String> instruments;
    private List<String> genres;
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
    private boolean active;
    private boolean suspended;
    
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}
