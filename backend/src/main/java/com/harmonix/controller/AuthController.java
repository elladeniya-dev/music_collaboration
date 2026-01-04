package com.harmonix.controller;

import com.harmonix.constant.AppConstants;
import com.harmonix.dto.response.ApiResponse;
import com.harmonix.dto.response.UserResponse;
import com.harmonix.entity.User;
import com.harmonix.mapper.UserMapper;
import com.harmonix.repository.UserRepository;
import com.harmonix.util.AuthUtil;
import com.harmonix.util.CookieUtil;
import com.harmonix.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping(AppConstants.AUTH_PATH)
@CrossOrigin(origins = "${cors.allowed-origins}", allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @GetMapping("/login/success")
    public void loginSuccess(
            @AuthenticationPrincipal OAuth2User principal,
            HttpServletResponse response
    ) throws IOException {
        if (principal == null) {
            response.sendRedirect(frontendUrl + "?error=auth_failed");
            return;
        }

        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String picture = principal.getAttribute("picture");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .email(email)
                                .name(name)
                                .profileImage(picture)
                                .userType(AppConstants.DEFAULT_USER_TYPE)
                                .build()
                ));

        String jwt = JwtUtil.generateToken(email);
        String cookie = CookieUtil.createTokenCookie(jwt, false);

        response.addHeader(HttpHeaders.SET_COOKIE, cookie);
        response.sendRedirect(frontendUrl + "/job");
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @CookieValue(name = AppConstants.TOKEN_COOKIE_NAME, required = false) String token) {
        
        User user = AuthUtil.requireUser(token, userRepository);
        UserResponse userResponse = userMapper.toResponse(user);
        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        String cookie = CookieUtil.deleteTokenCookie();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie)
                .body(ApiResponse.success("Logged out successfully", null));
    }
}
