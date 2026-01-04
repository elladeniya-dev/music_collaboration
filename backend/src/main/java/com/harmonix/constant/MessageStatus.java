package com.harmonix.constant;

public enum MessageStatus {
    SENT("sent"),
    DELIVERED("delivered"),
    READ("read");

    private final String value;

    MessageStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static MessageStatus fromValue(String value) {
        for (MessageStatus status : values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        return SENT;
    }
}
