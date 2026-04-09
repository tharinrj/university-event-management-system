package com.unievents.backend.auth.dto;

import com.unievents.backend.auth.model.User;

import java.time.LocalDateTime;

/**
 * DTO for user signup response.
 */
public record SignupResponse(
        String id,
        String email,
        String fullName,
        LocalDateTime createdAt
) {
    public static SignupResponse from(User user) {
        return new SignupResponse(
                user.id(),
                user.email(),
                user.fullName(),
                user.createdAt()
        );
    }
}

