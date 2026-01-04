package com.harmonix.mapper;

import com.harmonix.dto.response.UserResponse;
import com.harmonix.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profileImage(user.getProfileImage())
                .userType(user.getUserType())
                .build();
    }
}
