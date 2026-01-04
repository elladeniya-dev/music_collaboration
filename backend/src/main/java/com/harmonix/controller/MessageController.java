package com.harmonix.controller;

import com.harmonix.constant.AppConstants;
import com.harmonix.dto.response.ApiResponse;
import com.harmonix.entity.Message;
import com.harmonix.entity.User;
import com.harmonix.repository.MessageRepository;
import com.harmonix.repository.UserRepository;
import com.harmonix.util.AuthUtil;
import com.harmonix.service.MessageService;
import com.harmonix.service.ChatHeadService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping(AppConstants.MESSAGES_PATH)
@CrossOrigin(origins = "${cors.allowed-origins}", allowCredentials = "true")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final ChatHeadService chatHeadService;

    @PostMapping
    public ResponseEntity<ApiResponse<Message>> sendMessage(
            @RequestBody Message message, 
            HttpServletRequest request) {
        
        User user = AuthUtil.requireUser(request, userRepository);
        message.setSenderId(user.getId());
        message.setTimestamp(Instant.now());
        Message sentMessage = messageService.sendMessage(message);
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", sentMessage));
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<ApiResponse<List<Message>>> getChatHistory(@PathVariable String chatId) {
        List<Message> messages = messageService.getChatHistory(chatId);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<ApiResponse<String>> deleteChat(@PathVariable String chatId) {
        messageRepository.deleteByChatId(chatId);
        chatHeadService.deleteByChatId(chatId);
        return ResponseEntity.ok(ApiResponse.success("Chat deleted successfully", null));
    }
}
