package com.harmonix.service;

import com.harmonix.entity.ChatHead;
import com.harmonix.entity.Message;
import com.harmonix.repository.ChatHeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;
import java.util.stream.Stream;


import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatHeadService {
    
    private final ChatHeadRepository chatHeadRepository;

    public void deleteByChatId(String chatId) {
        chatHeadRepository.deleteById(chatId);
    }

    public void updateChatHeadFromMessage(Message message) {
        String chatId = message.getChatId();
        Optional<ChatHead> existing = chatHeadRepository.findById(chatId);

        ChatHead chatHead = existing.orElse(
                ChatHead.builder()
                        .id(chatId)
                        .participants(List.of(message.getSenderId(), message.getReceiverId()))
                        .build()
        );

        chatHead.setLastMessage(message.getMessage());
        chatHead.setLastUpdated(Instant.now());
        chatHead.setLastSenderId(message.getSenderId());
        chatHead.setLastMessageType(message.getType());

        chatHeadRepository.save(chatHead);
    }

    public List<ChatHead> getChatsForUser(String userId) {
        return chatHeadRepository.findByParticipantsContaining(userId);
    }

    public ChatHead createChatIfNotExists(String userId1, String userId2) {
        String chatId = generateChatId(userId1, userId2);
        Optional<ChatHead> existing = chatHeadRepository.findById(chatId);

        if (existing.isPresent()) return existing.get();

        ChatHead newChat = ChatHead.builder()
                .id(chatId)
                .participants(List.of(userId1, userId2))
                .lastMessage("Chat initiated via collaboration request.")
                .lastUpdated(Instant.now())
                .lastSenderId(userId1)
                .lastMessageType("text")
                .build();

        return chatHeadRepository.save(newChat);
    }

    private String generateChatId(String a, String b) {
        return Stream.of(a, b).sorted().collect(Collectors.joining("_"));
    }


}
