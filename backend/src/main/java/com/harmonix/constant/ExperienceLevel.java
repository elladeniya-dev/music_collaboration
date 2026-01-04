package com.harmonix.constant;

public enum ExperienceLevel {
    BEGINNER("Beginner - Learning the basics"),
    INTERMEDIATE("Intermediate - Comfortable with fundamentals"),
    ADVANCED("Advanced - Skilled and experienced"),
    PROFESSIONAL("Professional - Working musician"),
    STUDIO("Studio - Production and engineering");

    private final String description;

    ExperienceLevel(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
