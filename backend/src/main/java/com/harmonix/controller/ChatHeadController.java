package com.harmonix.controller;

import com.harmonix.model.ChatHead;
import com.harmonix.model.User;
import com.harmonix.repository.UserRepository;
import com.harmonix.security.AuthHelper;
import com.harmonix.service.ChatHeadService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat-heads")
@CrossOrigin(origins = "${cors.allowed-origins}", allowCredentials = "true")
public class ChatHeadController {

    private final ChatHeadService chatHeadService;
    private final UserRepository userRepo;

    public ChatHeadController(ChatHeadService chatHeadService, UserRepository userRepo) {
        this.chatHeadService = chatHeadService;
        this.userRepo = userRepo;
    }

    @GetMapping("/me")
    public List<ChatHead> getMyChatHeads(HttpServletRequest request) {
        User user = AuthHelper.requireUser(request, userRepo);
        return chatHeadService.getChatsForUser(user.getId());
    }
    @PostMapping("/create")
    public ResponseEntity<?> createChatIfNotExists(
            @RequestParam("userId2") String userId2,
            HttpServletRequest request
    ) {
        try {
            User sender = AuthHelper.requireUser(request, userRepo);
            return ResponseEntity.ok(chatHeadService.createChatIfNotExists(sender.getId(), userId2));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create chat: " + e.getMessage());
        }
    }

}
