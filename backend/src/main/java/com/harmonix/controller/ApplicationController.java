package com.harmonix.controller;

import com.harmonix.constant.ApplicationStatus;
import com.harmonix.dto.request.ApplicationCreateRequest;
import com.harmonix.dto.request.ApplicationStatusUpdateRequest;
import com.harmonix.dto.response.ApiResponse;
import com.harmonix.dto.response.ApplicationResponse;
import com.harmonix.security.CurrentUser;
import com.harmonix.security.UserPrincipal;
import com.harmonix.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {
    
    private final ApplicationService applicationService;
    
    /**
     * Submit an application to a job post
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationResponse>> createApplication(
            @CurrentUser UserPrincipal currentUser,
            @RequestBody ApplicationCreateRequest request) {
        
        ApplicationResponse response = applicationService.createApplication(
                currentUser.getId(),
                request
        );
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }
    
    /**
     * Get application by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getApplicationById(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable String id) {
        
        ApplicationResponse response = applicationService.getApplicationById(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Get applications for a job post (owner only)
     */
    @GetMapping("/job-post/{jobPostId}")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getApplicationsByJobPost(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable String jobPostId,
            @RequestParam(required = false) ApplicationStatus status) {
        
        List<ApplicationResponse> responses = applicationService.getApplicationsByJobPost(
                jobPostId,
                currentUser.getId(),
                status
        );
        
        return ResponseEntity.ok(ApiResponse.success(responses));
    }
    
    /**
     * Get user's own applications
     */
    @GetMapping("/my-applications")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getMyApplications(
            @CurrentUser UserPrincipal currentUser,
            @RequestParam(required = false) ApplicationStatus status) {
        
        List<ApplicationResponse> responses = applicationService.getApplicationsByApplicant(
                currentUser.getId(),
                status
        );
        
        return ResponseEntity.ok(ApiResponse.success(responses));
    }
    
    /**
     * Get applications submitted to user's job posts
     */
    @GetMapping("/received")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getReceivedApplications(
            @CurrentUser UserPrincipal currentUser,
            @RequestParam(required = false) ApplicationStatus status) {
        
        List<ApplicationResponse> responses = applicationService.getApplicationsByPostOwner(
                currentUser.getId(),
                status
        );
        
        return ResponseEntity.ok(ApiResponse.success(responses));
    }
    
    /**
     * Update application status (job post owner only)
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateApplicationStatus(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable String id,
            @RequestBody ApplicationStatusUpdateRequest request) {
        
        ApplicationResponse response = applicationService.updateApplicationStatus(
                id,
                currentUser.getId(),
                request.getStatus(),
                request.getRejectionReason(),
                request.getNotes()
        );
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Withdraw an application (applicant only)
     */
    @DeleteMapping("/{id}/withdraw")
    public ResponseEntity<ApiResponse<ApplicationResponse>> withdrawApplication(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable String id) {
        
        ApplicationResponse response = applicationService.withdrawApplication(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Check if user has applied to a job post
     */
    @GetMapping("/check/{jobPostId}")
    public ResponseEntity<ApiResponse<Boolean>> hasUserApplied(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable String jobPostId) {
        
        boolean hasApplied = applicationService.hasUserApplied(jobPostId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(hasApplied));
    }
}
