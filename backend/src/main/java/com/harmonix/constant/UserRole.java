package com.harmonix.constant;

public enum UserRole {
    USER("Regular user"),
    CREATOR("Content creator and collaborator"),
    ADMIN("Platform administrator");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
