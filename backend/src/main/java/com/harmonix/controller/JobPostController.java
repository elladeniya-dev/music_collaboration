package com.harmonix.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.harmonix.model.JobPost;
import com.harmonix.model.User;
import com.harmonix.repository.JobPostRepository;
import com.harmonix.repository.UserRepository;
import com.harmonix.security.AuthHelper;
import com.harmonix.service.JobPostService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/job-post")
@CrossOrigin(origins = "${cors.allowed-origins}", allowCredentials = "true")
public class JobPostController {

    private final JobPostService service;
    private final UserRepository userRepo;
    private final JobPostRepository repo;
    private final Cloudinary cloudinary;

    public JobPostController(JobPostService service,
                             UserRepository userRepo,
                             JobPostRepository repo,
                             @Value("${cloudinary.cloud_name}") String cloudName,
                             @Value("${cloudinary.api_key}") String apiKey,
                             @Value("${cloudinary.api_secret}") String apiSecret) {
        this.service = service;
        this.userRepo = userRepo;
        this.repo = repo;
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createJob(
            HttpServletRequest request,
            @RequestPart("title") String title,
            @RequestPart("description") String description,
            @RequestPart("skillsNeeded") String skillsNeeded,
            @RequestPart("collaborationType") String collaborationType,
            @RequestPart("availability") String availability,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
            User user = AuthHelper.requireUser(request, userRepo);

            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                Map<?, ?> uploadResult = cloudinary.uploader()
                        .upload(image.getBytes(), ObjectUtils.emptyMap());
                imageUrl = (String) uploadResult.get("secure_url");
            }

            JobPost post = service.createJobWithExtras(
                    user.getId(), title, description, skillsNeeded,
                    collaborationType, availability, user.getEmail(), imageUrl
            );

            return ResponseEntity.ok(post);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating job post: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<JobPost>> getAllJobs() {
        try {
            List<JobPost> jobs = service.getAllJobs();
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(
            HttpServletRequest request,
            @PathVariable("id") String id,
            @RequestPart("title") String title,
            @RequestPart("description") String description,
            @RequestPart("skillsNeeded") String skillsNeeded,
            @RequestPart("collaborationType") String collaborationType,
            @RequestPart("availability") String availability,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
            User user = AuthHelper.requireUser(request, userRepo);

            JobPost existingJob = repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

            if (!existingJob.getUserId().equals(user.getId())) {
                return ResponseEntity.status(403).body("You are not authorized to update this job post");
            }

            existingJob.setTitle(title);
            existingJob.setDescription(description);
            existingJob.setSkillsNeeded(skillsNeeded);
            existingJob.setCollaborationType(collaborationType);
            existingJob.setAvailability(availability);

            if (image != null && !image.isEmpty()) {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
                existingJob.setImageUrl((String) uploadResult.get("secure_url"));
            }

            repo.save(existingJob);

            return ResponseEntity.ok(existingJob);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating job post: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(
            HttpServletRequest request,
            @PathVariable("id") String id
    ) {
        try {
            User user = AuthHelper.requireUser(request, userRepo);

            JobPost jobPost = repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

            if (!jobPost.getUserId().equals(user.getId())) {
                return ResponseEntity.status(403).body("You are not authorized to delete this job post");
            }

            repo.deleteById(id);
            return ResponseEntity.ok("Job post deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting job post: " + e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable String id) {
        return repo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body("Job not found"));
    }



}
