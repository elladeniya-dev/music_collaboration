package com.harmonix.service;

import com.harmonix.constant.ExperienceLevel;
import com.harmonix.constant.UserRole;
import com.harmonix.dto.request.UpdateUserProfileRequest;
import com.harmonix.dto.response.UserProfileResponse;
import com.harmonix.entity.User;
import com.harmonix.exception.ResourceNotFoundException;
import com.harmonix.exception.UnauthorizedException;
import com.harmonix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    
    /**
     * Get user profile by ID
     */
    public UserProfileResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return mapToProfileResponse(user);
    }
    
    /**
     * Update user profile
     */
    @Transactional
    public UserProfileResponse updateProfile(String userId, UpdateUserProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        log.info("Updating profile for user: {}", userId);
        
        // Update basic info
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        
        // Update musician profile fields
        if (request.getInstruments() != null) {
            user.setInstruments(request.getInstruments());
        }
        if (request.getGenres() != null) {
            user.setGenres(request.getGenres());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }
        if (request.getTimezone() != null) {
            user.setTimezone(request.getTimezone());
        }
        if (request.getExperienceLevel() != null) {
            user.setExperienceLevel(request.getExperienceLevel());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        
        // Update external links
        if (request.getSpotifyUrl() != null) {
            user.setSpotifyUrl(request.getSpotifyUrl());
        }
        if (request.getYoutubeUrl() != null) {
            user.setYoutubeUrl(request.getYoutubeUrl());
        }
        if (request.getSoundcloudUrl() != null) {
            user.setSoundcloudUrl(request.getSoundcloudUrl());
        }
        if (request.getInstagramUrl() != null) {
            user.setInstagramUrl(request.getInstagramUrl());
        }
        if (request.getWebsiteUrl() != null) {
            user.setWebsiteUrl(request.getWebsiteUrl());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        log.info("Profile updated successfully for user: {}", userId);
        
        return mapToProfileResponse(updatedUser);
    }
    
    /**
     * Search users by criteria
     */
    public Page<UserProfileResponse> searchUsers(
            List<String> instruments,
            List<String> genres,
            String location,
            ExperienceLevel experienceLevel,
            Pageable pageable) {
        
        // For now, return all users - implement custom query later
        Page<User> users = userRepository.findAll(pageable);
        return users.map(this::mapToProfileResponse);
    }
    
    /**
     * Update user role (Admin only)
     */
    @Transactional
    public UserProfileResponse updateRole(String userId, UserRole newRole, String adminUserId) {
        // Verify admin
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));
        
        if (admin.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("Only admins can update user roles");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        log.info("Admin {} updating role for user {} from {} to {}", 
                adminUserId, userId, user.getRole(), newRole);
        
        user.setRole(newRole);
        user.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        return mapToProfileResponse(updatedUser);
    }
    
    /**
     * Suspend user (Admin only)
     */
    @Transactional
    public UserProfileResponse suspendUser(String userId, String reason, String adminUserId) {
        // Verify admin
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));
        
        if (admin.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("Only admins can suspend users");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        log.warn("Admin {} suspending user {}. Reason: {}", adminUserId, userId, reason);
        
        user.setSuspended(true);
        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        return mapToProfileResponse(updatedUser);
    }
    
    /**
     * Activate user (Admin only)
     */
    @Transactional
    public UserProfileResponse activateUser(String userId, String adminUserId) {
        // Verify admin
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));
        
        if (admin.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("Only admins can activate users");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        log.info("Admin {} activating user {}", adminUserId, userId);
        
        user.setSuspended(false);
        user.setActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        return mapToProfileResponse(updatedUser);
    }
    
    /**
     * Update last login timestamp
     */
    @Transactional
    public void updateLastLogin(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }
    
    /**
     * Map User entity to UserProfileResponse DTO
     */
    private UserProfileResponse mapToProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .instruments(user.getInstruments())
                .genres(user.getGenres())
                .location(user.getLocation())
                .timezone(user.getTimezone())
                .experienceLevel(user.getExperienceLevel())
                .bio(user.getBio())
                .spotifyUrl(user.getSpotifyUrl())
                .youtubeUrl(user.getYoutubeUrl())
                .soundcloudUrl(user.getSoundcloudUrl())
                .instagramUrl(user.getInstagramUrl())
                .websiteUrl(user.getWebsiteUrl())
                .role(user.getRole())
                .active(user.isActive())
                .suspended(user.isSuspended())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}
