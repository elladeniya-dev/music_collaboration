package com.harmonix.controller;

import com.harmonix.model.User;
import com.harmonix.repository.UserRepository;
import com.harmonix.security.AuthHelper;
import com.harmonix.security.JwtUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${cors.allowed-origins}", allowCredentials = "true")
public class AuthController {

    private final UserRepository userRepo;

    public AuthController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @GetMapping("/login/success")
    public void loginSuccess(
            @AuthenticationPrincipal OAuth2User principal,
            HttpServletResponse response
    ) throws IOException {
        if (principal == null) {
            response.sendRedirect("http://localhost:5173?error=auth_failed");
            return;
        }

        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String picture = principal.getAttribute("picture");

        Optional<User> existing = userRepo.findByEmail(email);
        User user = existing.orElseGet(() ->
                userRepo.save(new User(null, email, name, picture, "pending")));

        String jwt = JwtUtils.generateToken(email);

        ResponseCookie cookie = ResponseCookie.from("token", jwt)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(3600)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        response.sendRedirect("http://localhost:5173/job");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserFromCookie(@CookieValue(name = "token", required = false) String token) {
        try {
            User user = AuthHelper.requireUser(token, userRepo);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie deleteCookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .body("Logged out");
    }
}
