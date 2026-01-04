package com.harmonix.constant;

public enum NotificationType {
    APPLICATION_SUBMITTED("New application received"),
    APPLICATION_ACCEPTED("Your application was accepted"),
    APPLICATION_REJECTED("Your application was rejected"),
    APPLICATION_SHORTLISTED("You've been shortlisted"),
    MESSAGE_RECEIVED("New message received"),
    JOB_POST_CLOSED("Job post was closed"),
    COLLABORATION_COMPLETED("Collaboration completed"),
    SYSTEM_ANNOUNCEMENT("System announcement"),
    ACCOUNT_SUSPENDED("Account suspended"),
    ACCOUNT_WARNING("Account warning");

    private final String description;

    NotificationType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
