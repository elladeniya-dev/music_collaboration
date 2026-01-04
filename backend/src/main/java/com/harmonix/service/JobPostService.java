package com.harmonix.service;

import com.harmonix.constant.JobType;
import com.harmonix.constant.JobVisibility;
import com.harmonix.dto.request.JobPostCreateRequest;
import com.harmonix.dto.request.JobPostUpdateRequest;
import com.harmonix.dto.response.JobPostResponse;
import com.harmonix.dto.response.PagedResponse;
import com.harmonix.entity.JobPost;
import com.harmonix.exception.ResourceNotFoundException;
import com.harmonix.exception.UnauthorizedException;
import com.harmonix.mapper.JobPostMapper;
import com.harmonix.repository.JobPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class JobPostService {

    private final JobPostRepository jobPostRepository;
    private final JobPostMapper jobPostMapper;
    private final NotificationService notificationService;

    public JobPostResponse createJobPost(String userId, JobPostCreateRequest request) {
        JobPost jobPost = jobPostMapper.toEntity(request, userId);
        jobPost.setActive(true);
        jobPost.setClosed(false);
        jobPost.setViewCount(0);
        jobPost.setApplicationCount(0);
        jobPost.setPostedAt(LocalDateTime.now());
        
        JobPost savedJobPost = jobPostRepository.save(jobPost);
        log.info("Created job post: {} by user: {}", savedJobPost.getId(), userId);
        
        return jobPostMapper.toResponse(savedJobPost);
    }

    @Transactional(readOnly = true)
    public PagedResponse<JobPostResponse> getAllJobPosts(Pageable pageable) {
        Page<JobPost> jobPosts = jobPostRepository.findAll(pageable);
        return PagedResponse.of(jobPosts.map(jobPostMapper::toResponse));
    }
    
    @Transactional(readOnly = true)
    public List<JobPostResponse> getAllJobPostsList() {
        return jobPostRepository.findAll().stream()
                .map(jobPostMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobPostResponse getJobPostById(String id) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPost", "id", id));
        
        // Increment view count
        jobPost.setViewCount(jobPost.getViewCount() + 1);
        jobPostRepository.save(jobPost);
        
        return jobPostMapper.toResponse(jobPost);
    }

    @Transactional(readOnly = true)
    public List<JobPostResponse> getJobPostsByUserId(String userId) {
        return jobPostRepository.findByUserId(userId).stream()
                .map(jobPostMapper::toResponse)
                .collect(Collectors.toList());
    }

    public JobPostResponse updateJobPost(String id, String userId, JobPostUpdateRequest request) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPost", "id", id));

        // Verify ownership
        if (!jobPost.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only update your own job posts");
        }

        jobPostMapper.updateEntity(jobPost, request);
        jobPost.setUpdatedAt(LocalDateTime.now());
        
        JobPost updatedJobPost = jobPostRepository.save(jobPost);
        log.info("Updated job post: {}", id);
        
        return jobPostMapper.toResponse(updatedJobPost);
    }
    
    /**
     * Close a job post and notify all applicants
     */
    public JobPostResponse closeJobPost(String id, String userId) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPost", "id", id));
        
        // Verify ownership
        if (!jobPost.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only close your own job posts");
        }
        
        jobPost.setClosed(true);
        jobPost.setActive(false);
        jobPost.setClosedAt(LocalDateTime.now());
        
        JobPost closedJobPost = jobPostRepository.save(jobPost);
        log.info("Closed job post: {}", id);
        
        // Notify all applicants
        notificationService.notifyJobPostClosed(id, jobPost.getTitle());
        
        return jobPostMapper.toResponse(closedJobPost);
    }
    
    /**
     * Search job posts by criteria
     */
    @Transactional(readOnly = true)
    public PagedResponse<JobPostResponse> searchJobPosts(
            List<String> genres,
            List<String> instruments,
            List<JobType> jobTypes,
            String location,
            Boolean isPaid,
            JobVisibility visibility,
            Pageable pageable) {
        
        // For now, return all active job posts - implement custom query later
        Page<JobPost> jobPosts = jobPostRepository.findAll(pageable);
        return PagedResponse.of(jobPosts.map(jobPostMapper::toResponse));
    }

    public void deleteJobPost(String id, String userId) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPost", "id", id));
        
        // Verify ownership
        if (!jobPost.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own job posts");
        }
        
        jobPostRepository.deleteById(id);
        log.info("Deleted job post: {}", id);
    }
}
