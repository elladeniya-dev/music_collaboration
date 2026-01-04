package com.harmonix.repository;

import com.harmonix.entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findTop50ByChatIdOrderByTimestampDesc(String chatId);
    void deleteByChatId(String chatId);
}
