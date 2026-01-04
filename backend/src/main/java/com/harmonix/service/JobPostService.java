package com.harmonix.service;

import com.harmonix.dto.request.JobPostCreateRequest;
import com.harmonix.dto.request.JobPostUpdateRequest;
import com.harmonix.dto.response.JobPostResponse;
import com.harmonix.entity.JobPost;
import com.harmonix.exception.ResourceNotFoundException;
import com.harmonix.mapper.JobPostMapper;
import com.harmonix.repository.JobPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobPostService {

    private final JobPostRepository jobPostRepository;
    private final JobPostMapper jobPostMapper;

    public JobPostResponse createJobPost(String userId, JobPostCreateRequest request) {
        JobPost jobPost = jobPostMapper.toEntity(request, userId);
        JobPost savedJobPost = jobPostRepository.save(jobPost);
        return jobPostMapper.toResponse(savedJobPost);
    }

    @Transactional(readOnly = true)
    public List<JobPostResponse> getAllJobPosts() {
        return jobPostRepository.findAll().stream()
                .map(jobPostMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobPostResponse getJobPostById(String id) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPost", "id", id));
        return jobPostMapper.toResponse(jobPost);
    }

    @Transactional(readOnly = true)
    public List<JobPostResponse> getJobPostsByUserId(String userId) {
        return jobPostRepository.findByUserId(userId).stream()
                .map(jobPostMapper::toResponse)
                .collect(Collectors.toList());
    }

    public JobPostResponse updateJobPost(String id, JobPostUpdateRequest request) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPost", "id", id));

        jobPostMapper.updateEntity(jobPost, request);
        JobPost updatedJobPost = jobPostRepository.save(jobPost);
        return jobPostMapper.toResponse(updatedJobPost);
    }

    public void deleteJobPost(String id) {
        if (!jobPostRepository.existsById(id)) {
            throw new ResourceNotFoundException("JobPost", "id", id);
        }
        jobPostRepository.deleteById(id);
    }
}
