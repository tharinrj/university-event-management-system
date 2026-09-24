package com.unievents.backend.registrations.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "registrations")
public class RegistrationEntity {

    @Id
    @Column(name = "registration_id", nullable = false, updatable = false)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "event_id", nullable = false)
    private String eventId;

    @Column(name = "registration_date")
    private LocalDateTime registeredAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RegistrationStatus status;

    protected RegistrationEntity() {
        // Required by JPA
    }

    public RegistrationEntity(String id, String userId, String eventId,
                               LocalDateTime registeredAt, RegistrationStatus status) {
        this.id = id;
        this.userId = userId;
        this.eventId = eventId;
        this.registeredAt = registeredAt;
        this.status = status;
    }

    public static RegistrationEntity fromDomain(Registration registration) {
        return new RegistrationEntity(
                registration.id(),
                registration.userId(),
                registration.eventId(),
                registration.registeredAt(),
                registration.status()
        );
    }

    public Registration toDomain() {
        return new Registration(id, userId, eventId, registeredAt, status);
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getEventId() { return eventId; }
    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public RegistrationStatus getStatus() { return status; }
}
