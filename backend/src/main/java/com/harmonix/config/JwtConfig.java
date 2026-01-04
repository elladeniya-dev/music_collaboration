package com.harmonix.config;

import com.harmonix.util.JwtUtil;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    @PostConstruct
    public void init() {
        JwtUtil.initialize(jwtSecret, jwtExpiration);
    }
}

