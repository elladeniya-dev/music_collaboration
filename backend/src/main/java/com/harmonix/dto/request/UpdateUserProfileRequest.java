package com.harmonix.dto.request;

import com.harmonix.constant.ExperienceLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserProfileRequest {
    
    private String name;
    private String bio;
    private List<String> instruments;
    private List<String> genres;
    private String location;
    private String timezone;
    private ExperienceLevel experienceLevel;
    
    // External links
    private String spotifyUrl;
    private String youtubeUrl;
    private String soundcloudUrl;
    private String instagramUrl;
    private String websiteUrl;
}
