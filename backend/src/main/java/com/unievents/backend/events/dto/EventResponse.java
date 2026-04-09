package com.unievents.backend.events.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.unievents.backend.events.model.Event;

import java.time.format.DateTimeFormatter;

public record EventResponse(
        String id,
        String title,
        String description,
        String date,
        String time,
        String location,
        String category,
        @JsonProperty("isFeatured") boolean isFeatured
) {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM d, uuuu");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("h:mm a");

    public static EventResponse from(Event event) {
        return new EventResponse(
                event.id(),
                event.title(),
                event.description(),
                event.date().format(DATE_FORMATTER),
                event.time().format(TIME_FORMATTER),
                event.location(),
                event.category().getLabel(),
                event.featured()
        );
    }
}
