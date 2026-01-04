package com.harmonix.controller;

import com.harmonix.constant.AppConstants;
import com.harmonix.constant.JobType;
import com.harmonix.constant.JobVisibility;
import com.harmonix.dto.request.JobPostCreateRequest;
import com.harmonix.dto.request.JobPostUpdateRequest;
import com.harmonix.dto.response.ApiResponse;
import com.harmonix.dto.response.JobPostResponse;
import com.harmonix.dto.response.PagedResponse;
import com.harmonix.entity.JobPost;
import com.harmonix.entity.User;
import com.harmonix.exception.BadRequestException;
import com.harmonix.exception.ResourceNotFoundException;
import com.harmonix.repository.JobPostRepository;
import com.harmonix.repository.UserRepository;
import com.harmonix.security.CurrentUser;
import com.harmonix.security.UserPrincipal;
import com.harmonix.service.CloudinaryService;
import com.harmonix.service.JobPostService;
import com.harmonix.util.AuthUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(AppConstants.JOB_POSTS_PATH)
@RequiredArgsConstructor
public class JobPostController {

    private final JobPostService jobPostService;
    private final UserRepository userRepository;
    private final JobPostRepository jobPostRepository;
    private final CloudinaryService cloudinaryService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<JobPostResponse>> createJobPost(
            HttpServletRequest request,
            @RequestPart("title") String title,
            @RequestPart("description") String description,
            @RequestPart("skillsNeeded") String skillsNeeded,
            @RequestPart("collaborationType") String collaborationType,
            @RequestPart("availability") String availability,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        User user = AuthUtil.requireUser(request, userRepository);

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadImage(image);
        }

        JobPostCreateRequest createRequest = new JobPostCreateRequest(
                title, description, skillsNeeded, collaborationType,
                availability, user.getEmail(), imageUrl
        );

        JobPostResponse response = jobPostService.createJobPost(user.getId(), createRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job post created successfully", response));
    }

    /**
     * Get all job posts (paginated)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<JobPostResponse>>> getAllJobPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        PagedResponse<JobPostResponse> jobPosts = jobPostService.getAllJobPosts(pageable);
        return ResponseEntity.ok(ApiResponse.success(jobPosts));
    }
    
    /**
     * Get all job posts (non-paginated, for backward compatibility)
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<JobPostResponse>>> getAllJobPostsList() {
        List<JobPostResponse> jobPosts = jobPostService.getAllJobPostsList();
        return ResponseEntity.ok(ApiResponse.success(jobPosts));
    }
    
    /**
     * Search job posts with filters
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<JobPostResponse>>> searchJobPosts(
            @RequestParam(required = false) List<String> genres,
            @RequestParam(required = false) List<String> instruments,
            @RequestParam(required = false) List<JobType> jobTypes,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean isPaid,
            @RequestParam(required = false) JobVisibility visibility,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        PagedResponse<JobPostResponse> jobPosts = jobPostService.searchJobPosts(
                genres, instruments, jobTypes, location, isPaid, visibility, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(jobPosts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobPostResponse>> getJobPostById(@PathVariable String id) {
        JobPostResponse jobPost = jobPostService.getJobPostById(id);
        return ResponseEntity.ok(ApiResponse.success(jobPost));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JobPostResponse>> updateJobPost(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable("id") String id,
            @RequestPart("title") String title,
            @RequestPart("description") String description,
            @RequestPart("skillsNeeded") String skillsNeeded,
            @RequestPart("collaborationType") String collaborationType,
            @RequestPart("availability") String availability,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        JobPost existingJob = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPost", "id", id));

        if (!existingJob.getUserId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not authorized to update this job post");
        }

        String imageUrl = existingJob.getImageUrl();
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadImage(image);
        }

        JobPostUpdateRequest updateRequest = new JobPostUpdateRequest(
                title, description, skillsNeeded, collaborationType,
                availability, currentUser.getEmail(), imageUrl
        );

        JobPostResponse response = jobPostService.updateJobPost(id, currentUser.getId(), updateRequest);
        return ResponseEntity.ok(ApiResponse.success("Job post updated successfully", response));
    }
    
    /**
     * Close a job post
     */
    @PutMapping("/{id}/close")
    public ResponseEntity<ApiResponse<JobPostResponse>> closeJobPost(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable String id) {
        
        JobPostResponse response = jobPostService.closeJobPost(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Job post closed successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteJobPost(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable("id") String id
    ) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPost", "id", id));

        if (!jobPost.getUserId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not authorized to delete this job post");
        }

        jobPostService.deleteJobPost(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Job post deleted successfully", null));
    }
}
