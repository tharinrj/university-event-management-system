package com.unievents.backend.auth.exception;

/**
 * Exception thrown when a user tries to sign up with an email that already exists.
 */
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}

