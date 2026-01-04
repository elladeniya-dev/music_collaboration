package com.harmonix.controller;

import com.harmonix.constant.AppConstants;
import com.harmonix.constant.UserRole;
import com.harmonix.dto.request.UpdateUserProfileRequest;
import com.harmonix.dto.request.UserTypeUpdateRequest;
import com.harmonix.dto.response.ApiResponse;
import com.harmonix.dto.response.UserProfileResponse;
import com.harmonix.dto.response.UserResponse;
import com.harmonix.entity.User;
import com.harmonix.exception.ResourceNotFoundException;
import com.harmonix.mapper.UserMapper;
import com.harmonix.repository.UserRepository;
import com.harmonix.security.CurrentUser;
import com.harmonix.security.UserPrincipal;
import com.harmonix.service.UserService;
import com.harmonix.util.AuthUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(AppConstants.USERS_PATH)
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserService userService;

    @GetMapping("/{email}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserByEmail(@PathVariable String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        UserResponse userResponse = userMapper.toResponse(user);
        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }
    
    /**
     * Get user profile (new rich profile)
     */
    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(@PathVariable String userId) {
        UserProfileResponse profile = userService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
    
    /**
     * Get current user's profile
     */
    @GetMapping("/profile/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(
            @CurrentUser UserPrincipal currentUser) {
        UserProfileResponse profile = userService.getProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
    
    /**
     * Update current user's profile
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @CurrentUser UserPrincipal currentUser,
            @Valid @RequestBody UpdateUserProfileRequest request) {
        
        UserProfileResponse profile = userService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
    
    /**
     * Update user role (Admin only)
     */
    @PutMapping("/{userId}/role")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateUserRole(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable String userId,
            @RequestParam UserRole role) {
        
        UserProfileResponse profile = userService.updateRole(userId, role, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
    
    /**
     * Suspend user (Admin only)
     */
    @PutMapping("/{userId}/suspend")
    public ResponseEntity<ApiResponse<UserProfileResponse>> suspendUser(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable String userId,
            @RequestParam String reason) {
        
        UserProfileResponse profile = userService.suspendUser(userId, reason, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
    
    /**
     * Activate user (Admin only)
     */
    @PutMapping("/{userId}/activate")
    public ResponseEntity<ApiResponse<UserProfileResponse>> activateUser(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable String userId) {
        
        UserProfileResponse profile = userService.activateUser(userId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/type")
    public ResponseEntity<ApiResponse<String>> updateUserType(
            HttpServletRequest request,
            @Valid @RequestBody UserTypeUpdateRequest updateRequest) {

        User user = AuthUtil.requireUser(request, userRepository);
        user.setUserType(updateRequest.getUserType());
        userRepository.save(user);
        
        return ResponseEntity.ok(
                ApiResponse.success("User type updated to: " + updateRequest.getUserType(), null)
        );
    }

    @GetMapping("/bulk")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByIds(
            @RequestParam("ids") List<String> ids) {
        
        List<User> users = userRepository.findAllById(ids);
        List<UserResponse> userResponses = users.stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(userResponses));
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<ApiResponse<UserResponse>> fetchUserByEmail(@PathVariable String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        UserResponse userResponse = userMapper.toResponse(user);
        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }
}
