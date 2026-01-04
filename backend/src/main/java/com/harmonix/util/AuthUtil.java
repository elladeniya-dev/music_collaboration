package com.harmonix.util;

import com.harmonix.constant.AppConstants;
import com.harmonix.entity.User;
import com.harmonix.exception.UnauthorizedException;
import com.harmonix.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

public final class AuthUtil {

    private AuthUtil() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    public static User requireUser(HttpServletRequest request, UserRepository repo) {
        String token = extractTokenFromCookies(request);
        if (token == null) {
            throw new UnauthorizedException("Missing authentication token in cookies");
        }

        return getUserFromToken(token, repo);
    }

    public static User requireUser(String token, UserRepository repo) {
        if (token == null || token.isBlank()) {
            throw new UnauthorizedException("Token is missing or blank");
        }
        return getUserFromToken(token, repo);
    }

    public static String extractTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }
        
        for (Cookie cookie : request.getCookies()) {
            if (AppConstants.TOKEN_COOKIE_NAME.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private static User getUserFromToken(String token, UserRepository repo) {
        try {
            String email = JwtUtil.validateToken(token);
            System.out.println("🔍 AuthUtil: Looking up user with email: " + email);
            
            User user = repo.findByEmail(email).orElse(null);
            
            if (user != null) {
                System.out.println("✅ User found: " + user.getId() + " - " + user.getEmail());
                return user;
            } else {
                System.out.println("❌ No user found in database for email: " + email);
                System.out.println("💡 Checking if email case is the issue...");
                throw new UnauthorizedException("No user found for email in token");
            }
        } catch (Exception e) {
            System.out.println("❌ Error in getUserFromToken: " + e.getMessage());
            throw new UnauthorizedException("Token invalid or expired: " + e.getMessage());
        }
    }
}
