package com.harmonix.controller;

import com.harmonix.model.Message;
import com.harmonix.model.User;
import com.harmonix.repository.MessageRepository;
import com.harmonix.repository.UserRepository;
import com.harmonix.security.AuthHelper;
import com.harmonix.service.MessageService;
import com.harmonix.service.ChatHeadService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "${cors.allowed-origins}", allowCredentials = "true")
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepo;
    private final MessageRepository messageRepo;
    private final ChatHeadService chatHeadService;

    public MessageController(
            MessageService messageService,
            UserRepository userRepo,
            MessageRepository messageRepo,
            ChatHeadService chatHeadService
    ) {
        this.messageService = messageService;
        this.userRepo = userRepo;
        this.messageRepo = messageRepo;
        this.chatHeadService = chatHeadService;
    }

    @PostMapping
    public Message sendMessage(@RequestBody Message message, HttpServletRequest request) {
        User user = AuthHelper.requireUser(request, userRepo);
        message.setSenderId(user.getId());
        message.setTimestamp(Instant.now());
        return messageService.sendMessage(message);
    }

    @GetMapping("/{chatId}")
    public List<Message> getChatHistory(@PathVariable String chatId) {
        return messageService.getChatHistory(chatId);
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<?> deleteChat(@PathVariable String chatId) {
        try {
            messageRepo.deleteByChatId(chatId);
            chatHeadService.deleteByChatId(chatId);
            return ResponseEntity.ok("Chat deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete chat: " + e.getMessage());
        }
    }
}
