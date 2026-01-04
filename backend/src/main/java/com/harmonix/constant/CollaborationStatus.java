package com.harmonix.constant;

public enum CollaborationStatus {
    PENDING("pending"),
    ACCEPTED("accepted"),
    REJECTED("rejected");

    private final String value;

    CollaborationStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static CollaborationStatus fromValue(String value) {
        for (CollaborationStatus status : values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        return PENDING;
    }
}
