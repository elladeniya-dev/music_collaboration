package com.harmonix.service;

import com.harmonix.constant.ApplicationStatus;
import com.harmonix.constant.NotificationType;
import com.harmonix.dto.request.ApplicationCreateRequest;
import com.harmonix.dto.response.ApplicationResponse;
import com.harmonix.entity.Application;
import com.harmonix.entity.JobPost;
import com.harmonix.entity.User;
import com.harmonix.exception.BadRequestException;
import com.harmonix.exception.ResourceNotFoundException;
import com.harmonix.exception.UnauthorizedException;
import com.harmonix.repository.ApplicationRepository;
import com.harmonix.repository.JobPostRepository;
import com.harmonix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobPostRepository jobPostRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public ApplicationResponse createApplication(String applicantId, ApplicationCreateRequest request) {
        
        // Check if job post exists and is active
        JobPost jobPost = jobPostRepository.findById(request.getJobPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Job post not found"));
        
        if (jobPost.isClosed()) {
            throw new BadRequestException("This job post is closed");
        }
        
        // Check if user already applied
        if (applicationRepository.existsByJobPostIdAndApplicantId(request.getJobPostId(), applicantId)) {
            throw new BadRequestException("You have already applied to this job post");
        }
        
        // Create application
        Application application = Application.builder()
                .jobPostId(request.getJobPostId())
                .applicantId(applicantId)
                .postOwnerId(jobPost.getUserId())
                .coverLetter(request.getCoverLetter())
                .proposedRate(request.getProposedRate())
                .portfolioUrl(request.getPortfolioUrl())
                .status(ApplicationStatus.PENDING)
                .appliedAt(LocalDateTime.now())
                .build();
        
        Application saved = applicationRepository.save(application);
        
        // Update job post application count
        jobPost.setApplicationCount(jobPost.getApplicationCount() + 1);
        jobPostRepository.save(jobPost);
        
        // Send notification to job post owner
        notificationService.createNotification(
                jobPost.getUserId(),
                NotificationType.APPLICATION_SUBMITTED,
                "New Application Received",
                "Someone applied to your job post: " + jobPost.getTitle(),
                request.getJobPostId(),
                "JobPost",
                "/jobs/" + request.getJobPostId() + "/applications",
                false
        );
        
        log.info("Application created: {} for job post: {}", saved.getId(), request.getJobPostId());
        return mapToResponse(saved, jobPost);
    }
    
    public ApplicationResponse getApplicationById(String applicationId, String userId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        // User must be either the applicant or the post owner
        if (!application.getApplicantId().equals(userId) && 
            !application.getPostOwnerId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to view this application");
        }
        
        JobPost jobPost = jobPostRepository.findById(application.getJobPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Job post not found"));
        
        return mapToResponse(application, jobPost);
    }

    public List<ApplicationResponse> getApplicationsByJobPost(String jobPostId, String userId, 
                                                              ApplicationStatus status) {
        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new ResourceNotFoundException("Job post not found"));
        
        // Only post owner can view applications
        if (!jobPost.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to view these applications");
        }
        
        List<Application> applications;
        if (status != null) {
            applications = applicationRepository.findByJobPostIdAndStatus(jobPostId, status);
        } else {
            applications = applicationRepository.findByJobPostId(jobPostId);
        }
        
        return applications.stream()
                .map(app -> mapToResponse(app, jobPost))
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicationsByApplicant(String applicantId, 
                                                                ApplicationStatus status) {
        List<Application> applications;
        if (status != null) {
            applications = applicationRepository.findByApplicantIdAndStatus(applicantId, status);
        } else {
            applications = applicationRepository.findByApplicantId(applicantId);
        }
        
        return applications.stream()
                .map(app -> {
                    JobPost jobPost = jobPostRepository.findById(app.getJobPostId())
                            .orElse(null);
                    return mapToResponse(app, jobPost);
                })
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicationsByPostOwner(String postOwnerId, 
                                                               ApplicationStatus status) {
        List<Application> applications;
        if (status != null) {
            applications = applicationRepository.findByPostOwnerIdAndStatus(postOwnerId, status);
        } else {
            applications = applicationRepository.findByPostOwnerId(postOwnerId);
        }
        
        return applications.stream()
                .map(app -> {
                    JobPost jobPost = jobPostRepository.findById(app.getJobPostId())
                            .orElse(null);
                    return mapToResponse(app, jobPost);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(String applicationId, String userId,
                                                      ApplicationStatus newStatus, 
                                                      String rejectionReason, String notes) {
        
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        // Only post owner can change status
        if (!application.getPostOwnerId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this application");
        }
        
        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(newStatus);
        application.setReviewedAt(LocalDateTime.now());
        application.setRespondedAt(LocalDateTime.now());
        
        if (rejectionReason != null) {
            application.setRejectionReason(rejectionReason);
        }
        
        if (notes != null) {
            application.setNotes(notes);
        }
        
        if (newStatus == ApplicationStatus.COMPLETED) {
            application.setCompletedAt(LocalDateTime.now());
        }
        
        // Send notifications based on status
        if (newStatus == ApplicationStatus.ACCEPTED) {
            notificationService.createNotification(
                    application.getApplicantId(),
                    NotificationType.APPLICATION_ACCEPTED,
                    "Application Accepted! 🎉",
                    "Your application has been accepted!",
                    applicationId,
                    "Application",
                    "/applications/" + applicationId,
                    true
            );
        } else if (newStatus == ApplicationStatus.REJECTED) {
            notificationService.createNotification(
                    application.getApplicantId(),
                    NotificationType.APPLICATION_REJECTED,
                    "Application Update",
                    "Your application status has been updated",
                    applicationId,
                    "Application",
                    "/applications/" + applicationId,
                    false
            );
        } else if (newStatus == ApplicationStatus.SHORTLISTED) {
            notificationService.createNotification(
                    application.getApplicantId(),
                    NotificationType.APPLICATION_SHORTLISTED,
                    "You've Been Shortlisted! ⭐",
                    "Great news! You've been shortlisted",
                    applicationId,
                    "Application",
                    "/applications/" + applicationId,
                    true
            );
        }
        
        Application updated = applicationRepository.save(application);
        log.info("Application {} status updated from {} to {}", applicationId, oldStatus, newStatus);
        
        JobPost jobPost = jobPostRepository.findById(application.getJobPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Job post not found"));
        
        return mapToResponse(updated, jobPost);
    }

    @Transactional
    public ApplicationResponse withdrawApplication(String applicationId, String applicantId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        if (!application.getApplicantId().equals(applicantId)) {
            throw new UnauthorizedException("You are not authorized to withdraw this application");
        }
        
        if (application.getStatus() == ApplicationStatus.ACCEPTED || 
            application.getStatus() == ApplicationStatus.COMPLETED) {
            throw new BadRequestException("Cannot withdraw an accepted or completed application");
        }
        
        application.setStatus(ApplicationStatus.WITHDRAWN);
        Application updated = applicationRepository.save(application);
        
        log.info("Application {} withdrawn by applicant {}", applicationId, applicantId);
        
        JobPost jobPost = jobPostRepository.findById(application.getJobPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Job post not found"));
        
        return mapToResponse(updated, jobPost);
    }

    public long countApplicationsByJobPost(String jobPostId) {
        return applicationRepository.countByJobPostId(jobPostId);
    }

    public boolean hasUserApplied(String jobPostId, String applicantId) {
        return applicationRepository.existsByJobPostIdAndApplicantId(jobPostId, applicantId);
    }
    
    /**
     * Map Application entity to ApplicationResponse DTO
     */
    private ApplicationResponse mapToResponse(Application application, JobPost jobPost) {
        // Get applicant name
        String applicantName = userRepository.findById(application.getApplicantId())
                .map(User::getName)
                .orElse("Unknown User");
        
        return ApplicationResponse.builder()
                .id(application.getId())
                .jobPostId(application.getJobPostId())
                .jobPostTitle(jobPost != null ? jobPost.getTitle() : "Unknown Job")
                .applicantId(application.getApplicantId())
                .applicantName(applicantName)
                .postOwnerId(application.getPostOwnerId())
                .coverLetter(application.getCoverLetter())
                .proposedRate(application.getProposedRate())
                .portfolioUrl(application.getPortfolioUrl())
                .status(application.getStatus())
                .rejectionReason(application.getRejectionReason())
                .notes(application.getNotes())
                .chatHeadId(application.getChatHeadId())
                .appliedAt(application.getAppliedAt())
                .reviewedAt(application.getReviewedAt())
                .respondedAt(application.getRespondedAt())
                .completedAt(application.getCompletedAt())
                .build();
    }
}
