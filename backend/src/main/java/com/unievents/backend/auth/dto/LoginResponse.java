package com.unievents.backend.auth.dto;

import com.unievents.backend.auth.model.User;

/**
 * DTO for user login response.
 */
public record LoginResponse(
        String id,
        String email,
        String fullName,
        String token
) {
    public static LoginResponse from(User user, String token) {
        return new LoginResponse(
                user.id(),
                user.email(),
                user.fullName(),
                token
        );
    }
}
