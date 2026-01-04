package com.harmonix.constant;

public enum UserType {
    PENDING("pending"),
    ARTIST("artist"),
    PRODUCER("producer"),
    MUSICIAN("musician"),
    ENGINEER("engineer"),
    OTHER("other");

    private final String value;

    UserType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static UserType fromValue(String value) {
        for (UserType type : values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        return PENDING;
    }
}
