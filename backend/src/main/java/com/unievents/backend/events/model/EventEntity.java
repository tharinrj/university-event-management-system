package com.unievents.backend.events.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
public class EventEntity {

    @Id
    @Column(nullable = false, updatable = false)
    private String event_id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime time;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventCategory category;

    @Column(nullable = false)
    private boolean featured;

    /** ID of the user (organizer) who created this event. Nullable for seeded events. */
    @Column(name = "created_by")
    private String createdBy;

    protected EventEntity() {
        // Required by JPA.
    }

    public EventEntity(String id, String title, String description, LocalDate date, LocalTime time,
                       String location, EventCategory category, boolean featured, String createdBy) {
        this.event_id = id;
        this.title = title;
        this.description = description;
        this.date = date;
        this.time = time;
        this.location = location;
        this.category = category;
        this.featured = featured;
        this.createdBy = createdBy;
    }

    public static EventEntity fromDomain(Event event) {
        return new EventEntity(
                event.id(),
                event.title(),
                event.description(),
                event.date(),
                event.time(),
                event.location(),
                event.category(),
                event.featured(),
                event.createdBy()
        );
    }

    public Event toDomain() {
        return new Event(event_id, title, description, date, time, location, category, featured, createdBy);
    }

    public String getCreatedBy() { return createdBy; }
}
