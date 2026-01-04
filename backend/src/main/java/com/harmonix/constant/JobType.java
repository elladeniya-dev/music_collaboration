package com.harmonix.constant;

public enum JobType {
    COLLABORATION("Long-term collaboration"),
    ONE_TIME_GIG("One-time gig or session"),
    REMOTE("Remote work"),
    PAID("Paid opportunity"),
    FREE("Free/Volunteer collaboration"),
    PROJECT("Project-based work");

    private final String description;

    JobType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
