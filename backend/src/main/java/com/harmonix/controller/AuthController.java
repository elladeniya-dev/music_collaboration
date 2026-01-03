package com.harmonix.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.harmonix.model.User;
import com.harmonix.repository.UserRepository;
import com.harmonix.security.AuthHelper;
import com.harmonix.security.JwtUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${cors.allowed-origins}", allowCredentials = "true")
public class AuthController {

    private final UserRepository userRepo;
    private final String clientId;

    public AuthController(UserRepository userRepo,
                          @Value("${google.client.id}") String clientId) {
        this.userRepo = userRepo;
        this.clientId = clientId;
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody String token) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();

        GoogleIdToken idToken = verifier.verify(token);
        if (idToken == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");

        Optional<User> existing = userRepo.findByEmail(email);
        User user = existing.orElseGet(() ->
                userRepo.save(new User(null, email, name, picture, "pending")));

        String jwt = JwtUtils.generateToken(email);

        String cookieValue = ResponseCookie.from("token", jwt)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(3600)
                .build()
                .toString();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, cookieValue);
        headers.setContentType(MediaType.APPLICATION_JSON);

        return new ResponseEntity<>(user, headers, HttpStatus.OK);
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
