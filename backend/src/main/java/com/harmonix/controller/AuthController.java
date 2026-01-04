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
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping(AppConstants.AUTH_PATH)
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    // OAuth2 success handling is now done by OAuth2LoginSuccessHandler

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

    @GetMapping("/debug/cookies")
    public ResponseEntity<ApiResponse<String>> debugCookies(HttpServletRequest request) {
        StringBuilder cookieInfo = new StringBuilder();
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                cookieInfo.append(cookie.getName()).append("=").append(cookie.getValue()).append("; ");
            }
        } else {
            cookieInfo.append("No cookies received");
        }
        
        String message = "Cookies received: " + cookieInfo.toString();
        System.out.println("🔍 DEBUG: " + message);
        
        return ResponseEntity.ok(ApiResponse.success(message));
    }
}
