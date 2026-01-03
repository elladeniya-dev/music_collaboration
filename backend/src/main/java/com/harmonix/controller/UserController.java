package com.harmonix.controller;

import com.harmonix.model.User;
import com.harmonix.repository.UserRepository;
import com.harmonix.security.AuthHelper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${cors.allowed-origins}", allowCredentials = "true")
public class UserController {

    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }


    @GetMapping("/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        Optional<User> user = repo.findByEmail(email);
        return user.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }


    @PutMapping("/type")
    public ResponseEntity<?> updateUserType(
            HttpServletRequest request,
            @RequestParam String userType) {

        try {
            User user = AuthHelper.requireUser(request, repo);
            user.setUserType(userType);
            repo.save(user);
            return ResponseEntity.ok("User type updated to: " + userType);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized: " + e.getMessage());
        }
    }

    @GetMapping("/bulk")
    public ResponseEntity<?> getUsersByIds(@RequestParam("ids") List<String> ids) {
        List<User> users = repo.findAllById(ids);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<?> fetchUserByEmail(@PathVariable String email) {
        Optional<User> user = repo.findByEmail(email);
        return user.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }




}
