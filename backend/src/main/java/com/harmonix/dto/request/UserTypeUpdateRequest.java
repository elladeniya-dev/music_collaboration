package com.harmonix.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTypeUpdateRequest {
    
    @NotBlank(message = "User type is required")
    private String userType;
}
