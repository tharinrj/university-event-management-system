package com.unievents.backend.registrations.dto;

import com.unievents.backend.events.dto.EventResponse;
import com.unievents.backend.registrations.model.Registration;

import java.time.LocalDateTime;

/**
 * A registration paired with its event details.
 */
public record RegisteredEventResponse(
        String registrationId,
        LocalDateTime registeredAt,
        EventResponse event
) {
    public static RegisteredEventResponse from(Registration registration, EventResponse event) {
        return new RegisteredEventResponse(
                registration.id(),
                registration.registeredAt(),
                event
        );
    }
}
