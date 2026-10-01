package com.unievents.backend.auth.controller;

import com.unievents.backend.auth.dto.LoginRequest;
import com.unievents.backend.auth.dto.LoginResponse;
import com.unievents.backend.auth.dto.SignupRequest;
import com.unievents.backend.auth.dto.SignupResponse;
import com.unievents.backend.auth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for user authentication endpoints.
 */
@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Endpoint to register a new user.
     *
     * @param request the signup request containing user details
     * @return the signup response with the created user information
     */
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public SignupResponse signup(@Valid @RequestBody SignupRequest request) {
        var user = userService.signup(request);
        return SignupResponse.from(user);
    }

    /**
     * Endpoint to authenticate an existing user.
     *
     * @param request the login request containing email and password
     * @return the login response with the user information and session token
     */
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        var user  = userService.login(request);
        var token = userService.generateToken(user);
        return LoginResponse.from(user, token);
    }
}


