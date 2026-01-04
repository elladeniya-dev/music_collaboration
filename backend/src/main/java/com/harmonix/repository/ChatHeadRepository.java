package com.harmonix.repository;

import com.harmonix.entity.ChatHead;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatHeadRepository extends MongoRepository<ChatHead, String> {
    List<ChatHead> findByParticipantsContaining(String userId);

    @Override
    @NonNull
    Optional<ChatHead> findById(@NonNull String id);
}
