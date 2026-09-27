package com.unievents.backend.events.model;

import java.time.LocalDate;
import java.time.LocalTime;

public record Event(
        String id,
        String title,
        String description,
        LocalDate date,
        LocalTime time,
        String location,
        EventCategory category,
        boolean featured,
        String createdBy
) {
}
