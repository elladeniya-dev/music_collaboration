package com.harmonix.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageCreateRequest {
    
    @NotBlank(message = "Chat head ID is required")
    private String chatHeadId;
    
    @NotBlank(message = "Content is required")
    private String content;
}
