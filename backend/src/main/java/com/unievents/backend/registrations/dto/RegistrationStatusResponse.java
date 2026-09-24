package com.unievents.backend.registrations.dto;

/**
 * Response returned for registration status checks.
 */
public record RegistrationStatusResponse(
        boolean registered,
        long totalRegistrations
) {
}
