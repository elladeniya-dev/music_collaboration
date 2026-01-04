package com.harmonix.service;

import com.harmonix.entity.Message;
import com.harmonix.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {
    
    private final MessageRepository messageRepository;
    private final ChatHeadService chatHeadService;

    public Message sendMessage(Message message) {
        message.setTimestamp(Instant.now());
        Message saved = messageRepository.save(message);
        chatHeadService.updateChatHeadFromMessage(saved);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Message> getChatHistory(String chatId) {
        return messageRepository.findTop50ByChatIdOrderByTimestampDesc(chatId);
    }
    
    public void send(Message message) {
        if (message.getTimestamp() == null) {
            message.setTimestamp(Instant.now());
        }
        messageRepository.save(message);
    }

}
