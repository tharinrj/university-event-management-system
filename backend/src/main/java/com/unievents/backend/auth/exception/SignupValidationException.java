package com.unievents.backend.auth.exception;

/**
 * Exception thrown when signup validation fails.
 */
public class SignupValidationException extends RuntimeException {
    public SignupValidationException(String message) {
        super(message);
    }
}

