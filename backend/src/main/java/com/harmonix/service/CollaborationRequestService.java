package com.harmonix.service;

import com.harmonix.entity.CollaborationRequest;
import com.harmonix.exception.ResourceNotFoundException;
import com.harmonix.repository.CollaborationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CollaborationRequestService {

    private final CollaborationRequestRepository collaborationRequestRepository;

    public CollaborationRequest create(CollaborationRequest req) {
        req.setCreatedAt(Instant.now());
        req.setUpdatedAt(Instant.now());
        return collaborationRequestRepository.save(req);
    }

    public CollaborationRequest accept(String id) {
        CollaborationRequest req = collaborationRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CollaborationRequest", "id", id));
        req.setUpdatedAt(Instant.now());
        return collaborationRequestRepository.save(req);
    }

    @Transactional(readOnly = true)
    public List<CollaborationRequest> getAllOpen() {
        return collaborationRequestRepository.findAll();
    }

    public List<CollaborationRequest> getByCreator(String creatorId) {
        return collaborationRequestRepository.findByCreatorId(creatorId);
    }

    public CollaborationRequest update(String id, CollaborationRequest updated, String userId) {
        CollaborationRequest existing = collaborationRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CollaborationRequest", "id", id));

        if (!existing.getCreatorId().equals(userId)) {
            throw new ResourceNotFoundException("Unauthorized to update this request");
        }

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setUpdatedAt(Instant.now());

        return collaborationRequestRepository.save(existing);
    }

    public void delete(String id, String userId) {
        CollaborationRequest existing = collaborationRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CollaborationRequest", "id", id));

        if (!existing.getCreatorId().equals(userId)) {
            throw new ResourceNotFoundException("You can only delete your own requests");
        }

        collaborationRequestRepository.deleteById(id);
    }
}
