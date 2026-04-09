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

    protected EventEntity() {
        // Required by JPA.
    }

    public EventEntity(String id, String title, String description, LocalDate date, LocalTime time,
                       String location, EventCategory category, boolean featured) {
        this.event_id = id;
        this.title = title;
        this.description = description;
        this.date = date;
        this.time = time;
        this.location = location;
        this.category = category;
        this.featured = featured;
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
                event.featured()
        );
    }

    public Event toDomain() {
        return new Event(event_id, title, description, date, time, location, category, featured);
    }
}

