package com.harmonix.constant;

public enum ApplicationStatus {
    PENDING("Application submitted, awaiting review"),
    UNDER_REVIEW("Application is being reviewed"),
    SHORTLISTED("Candidate has been shortlisted"),
    ACCEPTED("Application accepted"),
    REJECTED("Application rejected"),
    WITHDRAWN("Application withdrawn by applicant"),
    COMPLETED("Collaboration completed");

    private final String description;

    ApplicationStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
