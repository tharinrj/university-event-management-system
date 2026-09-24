package com.unievents.backend.auth.dto;

import com.unievents.backend.auth.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * DTO for user signup request.
 * Password must be at least 8 characters and contain uppercase, lowercase, and digit.
 */
public record SignupRequest(
        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 255, message = "Full name must be between 2 and 255 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        String email,

        @NotBlank(message = "Password is required")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one digit"
        )
        String password,

        @NotBlank(message = "Password confirmation is required")
        String passwordConfirm,

        // Optional – null means STUDENT
        UserRole role
) {
}

