package com.harmonix.controller;

import com.harmonix.constant.AppConstants;
import com.harmonix.dto.response.ApiResponse;
import com.harmonix.entity.ChatHead;
import com.harmonix.entity.User;
import com.harmonix.repository.UserRepository;
import com.harmonix.util.AuthUtil;
import com.harmonix.service.ChatHeadService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(AppConstants.CHAT_HEADS_PATH)
@RequiredArgsConstructor
public class ChatHeadController {

    private final ChatHeadService chatHeadService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<ChatHead>>> getMyChatHeads(HttpServletRequest request) {
        User user = AuthUtil.requireUser(request, userRepository);
        List<ChatHead> chatHeads = chatHeadService.getChatsForUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success(chatHeads));
    }
    
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ChatHead>> createChatIfNotExists(
            @RequestParam("userId2") String userId2,
            HttpServletRequest request) {
        
        User sender = AuthUtil.requireUser(request, userRepository);
        ChatHead chatHead = chatHeadService.createChatIfNotExists(sender.getId(), userId2);
        return ResponseEntity.ok(ApiResponse.success("Chat created successfully", chatHead));
    }
}
