package com.harmonix.repository;

import com.harmonix.entity.CollaborationRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollaborationRequestRepository extends MongoRepository<CollaborationRequest, String> {
    List<CollaborationRequest> findByCreatorId(String creatorId);
}
