package com.harmonix.controller;

import com.harmonix.model.CollaborationRequest;
import com.harmonix.model.Message;
import com.harmonix.model.User;
import com.harmonix.repository.CollaborationRequestRepository;
import com.harmonix.repository.UserRepository;
import com.harmonix.security.AuthHelper;
import com.harmonix.service.ChatHeadService;
import com.harmonix.service.CollaborationRequestService;
import com.harmonix.service.MessageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/collab-requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}", allowCredentials = "true")
public class CollaborationRequestController {

    private final CollaborationRequestService service;
    private final MessageService messageService;
    private final ChatHeadService chatHeadService;
    private final UserRepository userRepo;
    private final CollaborationRequestRepository collaborationRequestRepository;

    @PostMapping
    public CollaborationRequest createRequest(
            @RequestBody CollaborationRequest req,
            HttpServletRequest request
    ) {
        User user = AuthHelper.requireUser(request, userRepo);
        req.setCreatorId(user.getId());
        return service.create(req);
    }

    @PostMapping("/{id}/accept")
    public CollaborationRequest acceptRequest(
            @PathVariable String id,
            HttpServletRequest request
    ) {
        User user = AuthHelper.requireUser(request, userRepo);
        CollaborationRequest accepted = service.accept(id);

        chatHeadService.createChatIfNotExists(user.getId(), accepted.getCreatorId());

        Message msg = Message.builder()
                .chatId(generateChatId(accepted.getCreatorId(), user.getId()))
                .senderId(user.getId())
                .receiverId(accepted.getCreatorId())
                .message("I'm interested in collaborating on your project: '" + accepted.getTitle() + "'")
                .type("text")
                .status("sent")
                .timestamp(Instant.now())
                .build();

        messageService.send(msg);
        return accepted;
    }

    @GetMapping("/open")
    public List<CollaborationRequest> getOpenRequests() {
        return service.getAllOpen();
    }

    @GetMapping("/all")
    public List<CollaborationRequest> getAllVisibleRequests() {
        return collaborationRequestRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @PutMapping("/{id}")
    public CollaborationRequest updateRequest(
            @PathVariable String id,
            @RequestBody CollaborationRequest updated,
            HttpServletRequest request
    ) {
        User user = AuthHelper.requireUser(request, userRepo);
        return service.update(id, updated, user.getId());
    }

    @DeleteMapping("/{id}")
    public void deleteRequest(@PathVariable String id, HttpServletRequest request) {
        User user = AuthHelper.requireUser(request, userRepo);
        service.delete(id, user.getId());
    }

    private String generateChatId(String a, String b) {
        return Stream.of(a, b).sorted().collect(Collectors.joining("_"));
    }
}
