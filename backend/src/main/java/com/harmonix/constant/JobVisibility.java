package com.harmonix.constant;

public enum JobVisibility {
    PUBLIC("Visible to everyone"),
    INVITE_ONLY("Only visible to invited users"),
    PRIVATE("Private, not searchable");

    private final String description;

    JobVisibility(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
