package com.unievents.backend.auth.service;

import com.unievents.backend.auth.dto.LoginRequest;
import com.unievents.backend.auth.dto.SignupRequest;
import com.unievents.backend.auth.exception.InvalidCredentialsException;
import com.unievents.backend.auth.exception.SignupValidationException;
import com.unievents.backend.auth.exception.UserAlreadyExistsException;
import com.unievents.backend.auth.model.User;
import com.unievents.backend.auth.model.UserEntity;
import com.unievents.backend.auth.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service for user authentication and account management.
 */
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a new user with the given signup details.
     *
     * @param request the signup request containing user details
     * @return the created user
     * @throws UserAlreadyExistsException if a user with the same email already exists
     * @throws SignupValidationException if passwords don't match or other validation fails
     */
    public User signup(SignupRequest request) {
        // Validate that passwords match
        if (!request.password().equals(request.passwordConfirm())) {
            throw new SignupValidationException("Passwords do not match");
        }

        // Check if email already exists
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new UserAlreadyExistsException("User with email '" + request.email() + "' already exists");
        }

        // Create new user
        String userId = generateUserId();
        LocalDateTime now = LocalDateTime.now();
        String encodedPassword = passwordEncoder.encode(request.password());

        User user = new User(
                userId,
                request.email(),
                request.fullName(),
                encodedPassword,
                now,
                now
        );

        UserEntity userEntity = UserEntity.fromDomain(user);
        UserEntity saved = userRepository.save(userEntity);

        return saved.toDomain();
    }

    /**
     * Authenticates a user with the given login credentials.
     *
     * @param request the login request containing email and password
     * @return the authenticated user
     * @throws InvalidCredentialsException if the email is not found or the password is incorrect
     */
    @Transactional(readOnly = true)
    public User login(LoginRequest request) {
        UserEntity userEntity = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        User user = userEntity.toDomain();

        if (!passwordEncoder.matches(request.password(), user.password())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return user;
    }

    /**
     * Generates a new session token.
     *
     * @return a new UUID string to use as a session token
     */
    public String generateToken() {
        return UUID.randomUUID().toString();
    }

    /**
     * Generates a new unique user ID.
     *
     * @return a new UUID string
     */
    public String generateUserId() {
        return UUID.randomUUID().toString();
    }
}


