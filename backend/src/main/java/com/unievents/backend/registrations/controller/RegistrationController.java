package com.unievents.backend.registrations.controller;

import com.unievents.backend.registrations.dto.RegisteredEventResponse;
import com.unievents.backend.registrations.dto.RegistrationRequest;
import com.unievents.backend.registrations.dto.RegistrationStatusResponse;
import com.unievents.backend.registrations.service.RegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST endpoints for event registrations.
 *
 * <ul>
 *   <li>POST   /api/events/{id}/register              – register for an event</li>
 *   <li>DELETE /api/events/{id}/register              – cancel a registration</li>
 *   <li>GET    /api/events/{id}/registration-status   – check registration status</li>
 *   <li>GET    /api/users/{userId}/registrations      – all registered events for a user</li>
 * </ul>
 */
@RestController
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    /** Register the given user for an event. */
    @PostMapping("/api/events/{eventId}/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrationStatusResponse register(
            @PathVariable String eventId,
            @RequestBody RegistrationRequest request
    ) {
        if (request.userId() == null || request.userId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }
        try {
            registrationService.register(request.userId(), eventId);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
        return new RegistrationStatusResponse(true,
                registrationService.countRegistrations(eventId));
    }

    /** Cancel the given user's registration for an event. */
    @DeleteMapping("/api/events/{eventId}/register")
    @ResponseStatus(HttpStatus.OK)
    public RegistrationStatusResponse cancel(
            @PathVariable String eventId,
            @RequestBody RegistrationRequest request
    ) {
        if (request.userId() == null || request.userId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }
        try {
            registrationService.cancel(request.userId(), eventId);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
        return new RegistrationStatusResponse(false,
                registrationService.countRegistrations(eventId));
    }

    /** Check whether a user is registered for an event. */
    @GetMapping("/api/events/{eventId}/registration-status")
    public RegistrationStatusResponse status(
            @PathVariable String eventId,
            @RequestParam String userId
    ) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }
        boolean registered = registrationService.isRegistered(userId, eventId);
        long total = registrationService.countRegistrations(eventId);
        return new RegistrationStatusResponse(registered, total);
    }

    /** Get all registered events for a user (for the profile page). */
    @GetMapping("/api/users/{userId}/registrations")
    public List<RegisteredEventResponse> userRegistrations(@PathVariable String userId) {
        return registrationService.getRegisteredEvents(userId);
    }
}
