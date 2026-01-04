package com.harmonix.mapper;

import com.harmonix.dto.response.MessageResponse;
import com.harmonix.entity.Message;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Component
public class MessageMapper {

    public MessageResponse toResponse(Message message) {
        if (message == null) {
            return null;
        }
        
        return MessageResponse.builder()
                .id(message.getId())
                .chatHeadId(message.getChatId())
                .senderId(message.getSenderId())
                .content(message.getMessage())
                .timestamp(message.getTimestamp() != null 
                        ? LocalDateTime.ofInstant(message.getTimestamp(), ZoneId.systemDefault())
                        : null)
                .build();
    }
}
