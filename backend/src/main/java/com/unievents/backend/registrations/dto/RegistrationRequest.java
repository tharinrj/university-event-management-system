package com.unievents.backend.registrations.dto;

/**
 * Request body for registering or cancelling, carrying the authenticated user's ID.
 */
public record RegistrationRequest(
        String userId
) {
}
