package com.harmonix.config;

import com.harmonix.security.JwtUtils;
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
        JwtUtils.initialize(jwtSecret, jwtExpiration);
    }
}

