package com.harmonix.mapper;

import com.harmonix.dto.request.JobPostCreateRequest;
import com.harmonix.dto.request.JobPostUpdateRequest;
import com.harmonix.dto.response.JobPostResponse;
import com.harmonix.entity.JobPost;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class JobPostMapper {

    public JobPost toEntity(JobPostCreateRequest request, String userId) {
        if (request == null) {
            return null;
        }
        
        return JobPost.builder()
                .userId(userId)
                .title(request.getTitle())
                .description(request.getDescription())
                .skillsNeeded(request.getSkillsNeeded())
                .collaborationType(request.getCollaborationType())
                .availability(request.getAvailability())
                .contactMethod(request.getContactMethod())
                .imageUrl(request.getImageUrl())
                .postedAt(LocalDateTime.now())
                .build();
    }

    public JobPostResponse toResponse(JobPost jobPost) {
        if (jobPost == null) {
            return null;
        }
        
        return JobPostResponse.builder()
                .id(jobPost.getId())
                .userId(jobPost.getUserId())
                .title(jobPost.getTitle())
                .description(jobPost.getDescription())
                .skillsNeeded(jobPost.getSkillsNeeded())
                .collaborationType(jobPost.getCollaborationType())
                .availability(jobPost.getAvailability())
                .contactMethod(jobPost.getContactMethod())
                .imageUrl(jobPost.getImageUrl())
                .postedAt(jobPost.getPostedAt())
                .build();
    }

    public void updateEntity(JobPost jobPost, JobPostUpdateRequest request) {
        if (request.getTitle() != null) {
            jobPost.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            jobPost.setDescription(request.getDescription());
        }
        if (request.getSkillsNeeded() != null) {
            jobPost.setSkillsNeeded(request.getSkillsNeeded());
        }
        if (request.getCollaborationType() != null) {
            jobPost.setCollaborationType(request.getCollaborationType());
        }
        if (request.getAvailability() != null) {
            jobPost.setAvailability(request.getAvailability());
        }
        if (request.getContactMethod() != null) {
            jobPost.setContactMethod(request.getContactMethod());
        }
        if (request.getImageUrl() != null) {
            jobPost.setImageUrl(request.getImageUrl());
        }
    }
}
