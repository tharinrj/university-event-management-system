package com.unievents.backend.events.exception;

/**
 * Exception thrown when a validation error occurs during event creation or update.
 */
public class EventValidationException extends RuntimeException {
    public EventValidationException(String message) {
        super(message);
    }

    public EventValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}

