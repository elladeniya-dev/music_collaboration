package com.harmonix.security;

import com.harmonix.constant.AppConstants;
import com.harmonix.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        System.out.println("🔒 JwtAuthFilter: Processing request to " + request.getRequestURI());

        // Always process JWT cookie if present (don't skip even if OAuth2 authenticated)
        // This ensures controllers can extract user from JWT via AuthUtil.requireUser()
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (AppConstants.TOKEN_COOKIE_NAME.equals(cookie.getName())) {
                    System.out.println("🍪 Found JWT cookie: " + cookie.getValue().substring(0, Math.min(50, cookie.getValue().length())) + "...");
                    String email = JwtUtil.validateAndGetEmail(cookie.getValue());
                    if (email != null) {
                        System.out.println("✅ JWT valid for email: " + email);
                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(
                                        email, null, null
                                );
                        auth.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );
                        SecurityContextHolder.getContext()
                                .setAuthentication(auth);
                    } else {
                        System.out.println("❌ JWT validation failed");
                    }
                }
            }
        } else {
            System.out.println("⚠️ No cookies found in request");
        }

        filterChain.doFilter(request, response);
    }
}
