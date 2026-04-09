package com.unievents.backend.events.model;

import java.util.Arrays;

public enum EventCategory {
    HACKATHON("Hackathon"),
    GUEST_LECTURE("Guest Lecture"),
    WORKSHOP("Workshop"),
    CLUB_FAIR("Club Fair"),
    NETWORKING("Networking"),
    CULTURAL("Cultural");

    private final String label;

    EventCategory(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static EventCategory fromLabel(String label) {
        return Arrays.stream(values())
                .filter(value -> value.label.equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown category: " + label));
    }
}
