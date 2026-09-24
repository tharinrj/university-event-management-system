package com.unievents.backend.registrations.service;

import com.unievents.backend.events.dto.EventResponse;
import com.unievents.backend.events.model.EventEntity;
import com.unievents.backend.events.repository.EventRepository;
import com.unievents.backend.registrations.dto.RegisteredEventResponse;
import com.unievents.backend.registrations.model.Registration;
import com.unievents.backend.registrations.model.RegistrationEntity;
import com.unievents.backend.registrations.model.RegistrationStatus;
import com.unievents.backend.registrations.repository.RegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

/**
 * Service for student event registrations.
 */
@Service
@Transactional
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    public RegistrationService(RegistrationRepository registrationRepository,
                                EventRepository eventRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
    }

    /**
     * Registers a student for an event. Idempotent — if they already have an active
     * registration it is returned unchanged.
     */
    public Registration register(String userId, String eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new IllegalArgumentException("Event not found: " + eventId);
        }

        // Reactivate a previously cancelled registration
        return registrationRepository.findByUserIdAndEventId(userId, eventId)
                .map(existing -> {
                    if (existing.getStatus() == RegistrationStatus.REGISTERED) {
                        return existing.toDomain();
                    }
                    // Re-register after cancellation: create a fresh one
                    registrationRepository.delete(existing);
                    return save(userId, eventId);
                })
                .orElseGet(() -> save(userId, eventId));
    }

    /**
     * Cancels a student's registration for an event.
     *
     * @throws IllegalArgumentException if no active registration exists.
     */
    public void cancel(String userId, String eventId) {
        RegistrationEntity entity = registrationRepository
                .findByUserIdAndEventId(userId, eventId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No registration found for this event"));

        if (entity.getStatus() != RegistrationStatus.REGISTERED) {
            throw new IllegalArgumentException("Registration is already cancelled");
        }

        registrationRepository.delete(entity);
    }

    /**
     * Returns whether the given user has an active registration for the event.
     */
    @Transactional(readOnly = true)
    public boolean isRegistered(String userId, String eventId) {
        return registrationRepository.existsByUserIdAndEventIdAndStatus(
                userId, eventId, RegistrationStatus.REGISTERED);
    }

    /**
     * Returns the count of active registrations for an event.
     */
    @Transactional(readOnly = true)
    public long countRegistrations(String eventId) {
        return registrationRepository.countByEventIdAndStatus(
                eventId, RegistrationStatus.REGISTERED);
    }

    /**
     * Returns all active registrations for a user, each paired with the event details.
     * Sorted by event date ascending (upcoming first).
     */
    @Transactional(readOnly = true)
    public List<RegisteredEventResponse> getRegisteredEvents(String userId) {
        return registrationRepository
                .findAllByUserIdAndStatus(userId, RegistrationStatus.REGISTERED)
                .stream()
                .map(reg -> {
                    Registration domain = reg.toDomain();
                    return eventRepository.findById(domain.eventId())
                            .map(EventEntity::toDomain)
                            .map(event -> RegisteredEventResponse.from(domain, EventResponse.from(event)))
                            .orElse(null);
                })
                .filter(r -> r != null)
                .sorted(Comparator.comparing(r -> r.event().date()))
                .toList();
    }

    private Registration save(String userId, String eventId) {
        RegistrationEntity entity = new RegistrationEntity(
                UUID.randomUUID().toString(),
                userId,
                eventId,
                LocalDateTime.now(),
                RegistrationStatus.REGISTERED
        );
        return registrationRepository.save(entity).toDomain();
    }
}
