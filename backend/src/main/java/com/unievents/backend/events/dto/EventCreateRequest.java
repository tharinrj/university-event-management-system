package com.unievents.backend.events.dto;

import com.unievents.backend.events.model.EventCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public record EventCreateRequest(
        @NotBlank @Size(max = 120) String title,
        @NotBlank @Size(max = 2000) String description,
        @NotNull LocalDate date,
        @NotNull LocalTime time,
        @NotBlank @Size(max = 200) String location,
        @NotBlank String category,
        boolean featured,
        String createdBy
) {
    public EventCategory parsedCategory() {
        return EventCategory.fromLabel(category);
    }
}

