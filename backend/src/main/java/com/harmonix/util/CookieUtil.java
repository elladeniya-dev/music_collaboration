package com.harmonix.util;

import org.springframework.http.ResponseCookie;

import com.harmonix.constant.AppConstants;

public final class CookieUtil {

    private CookieUtil() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    public static String createTokenCookie(String token, boolean secure) {
        ResponseCookie cookie = ResponseCookie.from(AppConstants.TOKEN_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .sameSite("Lax")
                .maxAge(AppConstants.TOKEN_MAX_AGE_SECONDS)
                .build();
        
        return cookie.toString();
    }

    public static String deleteTokenCookie() {
        ResponseCookie cookie = ResponseCookie.from(AppConstants.TOKEN_COOKIE_NAME, "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        
        return cookie.toString();
    }
}
