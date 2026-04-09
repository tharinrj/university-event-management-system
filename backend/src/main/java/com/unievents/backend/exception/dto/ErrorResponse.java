package com.unievents.backend.exception.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standard error response DTO for API error responses.
 */
public record ErrorResponse(
        int status,
        String message,
        String error,
        LocalDateTime timestamp,
        String path,
        List<FieldError> fieldErrors
) {
    public ErrorResponse(int status, String message, String error, LocalDateTime timestamp, String path) {
        this(status, message, error, timestamp, path, null);
    }

    /**
     * DTO for validation field errors.
     */
    public record FieldError(
            String field,
            String message,
            String rejectedValue
    ) {}
}

