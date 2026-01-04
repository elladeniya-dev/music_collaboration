package com.harmonix.dto.request;

import com.harmonix.constant.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationStatusUpdateRequest {
    private ApplicationStatus status;
    private String rejectionReason;
    private String notes;
}
