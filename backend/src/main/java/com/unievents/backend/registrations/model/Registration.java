package com.unievents.backend.registrations.model;

import java.time.LocalDateTime;

/**
 * Domain model for a registration of a user to an event.
 */
public record Registration(
        String id,
        String userId,
        String eventId,
        LocalDateTime registeredAt,
        RegistrationStatus status
) {
}
