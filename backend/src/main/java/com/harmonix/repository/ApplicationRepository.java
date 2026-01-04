package com.harmonix.repository;

import com.harmonix.constant.ApplicationStatus;
import com.harmonix.entity.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {
    
    List<Application> findByJobPostId(String jobPostId);
    
    List<Application> findByApplicantId(String applicantId);
    
    List<Application> findByPostOwnerId(String postOwnerId);
    
    List<Application> findByJobPostIdAndStatus(String jobPostId, ApplicationStatus status);
    
    List<Application> findByApplicantIdAndStatus(String applicantId, ApplicationStatus status);
    
    List<Application> findByPostOwnerIdAndStatus(String postOwnerId, ApplicationStatus status);
    
    Optional<Application> findByJobPostIdAndApplicantId(String jobPostId, String applicantId);
    
    long countByJobPostId(String jobPostId);
    
    long countByJobPostIdAndStatus(String jobPostId, ApplicationStatus status);
    
    boolean existsByJobPostIdAndApplicantId(String jobPostId, String applicantId);
}
