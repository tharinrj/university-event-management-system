package com.unievents.backend.auth.model;

import java.time.LocalDateTime;

/**
 * Domain model for User.
 */
public record User(
        String id,
        String email,
        String fullName,
        String password,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}

