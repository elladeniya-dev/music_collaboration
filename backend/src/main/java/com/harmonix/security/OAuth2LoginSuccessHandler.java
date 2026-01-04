package com.harmonix.security;

import com.harmonix.constant.AppConstants;
import com.harmonix.entity.User;
import com.harmonix.repository.UserRepository;
import com.harmonix.util.CookieUtil;
import com.harmonix.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        log.info("OAuth2 login successful for user: {}", email);

        // Find or create user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    log.info("Creating new user: {}", email);
                    return userRepository.save(
                            User.builder()
                                    .email(email)
                                    .name(name)
                                    .profileImage(picture)
                                    .userType(AppConstants.DEFAULT_USER_TYPE)
                                    .build()
                    );
                });

        log.info("User saved/found with ID: {}", user.getId());

        // Generate JWT token
        String jwt = JwtUtil.generateToken(email);
        String cookie = CookieUtil.createTokenCookie(jwt, false);

        // Set cookie in response
        response.addHeader(HttpHeaders.SET_COOKIE, cookie);
        
        log.info("JWT cookie set for user: {}", email);

        // Redirect to frontend
        String redirectUrl = frontendUrl + "/oauth/callback";
        log.info("Redirecting to: {}", redirectUrl);
        
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
