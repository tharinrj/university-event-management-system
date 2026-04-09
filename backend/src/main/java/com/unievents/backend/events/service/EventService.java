package com.unievents.backend.events.service;

import com.unievents.backend.events.model.Event;
import com.unievents.backend.events.model.EventCategory;
import com.unievents.backend.events.model.EventEntity;
import com.unievents.backend.events.repository.EventRepository;
import com.unievents.backend.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;


@Service
@Transactional(readOnly = true)
public class EventService {

    private static final List<Event> SEED_EVENTS = List.of(
            new Event(
                    "1",
                    "HackUni 2026",
                    "36-hour hackathon bringing together 500+ students to build innovative solutions for real-world Uni challenges.",
                    LocalDate.of(2026, 4, 5),
                    LocalTime.of(18, 0),
                    "Engineering Building, Hall A",
                    EventCategory.HACKATHON,
                    true
            ),
            new Event(
                    "2",
                    "AI in Higher Education: A Guest Lecture",
                    "Dr. Sarah Chen from MIT discusses how artificial intelligence is reshaping university learning and research.",
                    LocalDate.of(2026, 3, 22),
                    LocalTime.of(14, 0),
                    "Science Auditorium, Room 301",
                    EventCategory.GUEST_LECTURE,
                    false
            ),
            new Event(
                    "3",
                    "Spring Club Fair 2026",
                    "Explore 100+ student organizations, find your community, and sign up for clubs that match your interests.",
                    LocalDate.of(2026, 3, 30),
                    LocalTime.of(10, 0),
                    "Student Union Plaza",
                    EventCategory.CLUB_FAIR,
                    false
            ),
            new Event(
                    "4",
                    "Intro to Cloud Computing Workshop",
                    "Hands-on workshop covering AWS fundamentals, deployment pipelines, and serverless architectures for beginners.",
                    LocalDate.of(2026, 4, 2),
                    LocalTime.of(16, 0),
                    "CS Lab 204",
                    EventCategory.WORKSHOP,
                    false
            ),
            new Event(
                    "5",
                    "Industry Networking Night",
                    "Connect with recruiters and alumni from top tech companies. Bring your resume and your curiosity.",
                    LocalDate.of(2026, 4, 10),
                    LocalTime.of(19, 0),
                    "Business School Atrium",
                    EventCategory.NETWORKING,
                    false
            ),
            new Event(
                    "6",
                    "International Culture Festival",
                    "Celebrate diversity with performances, food stalls, and exhibitions representing 40+ countries on Uni.",
                    LocalDate.of(2026, 4, 18),
                    LocalTime.of(11, 0),
                    "Main Quad & Amphitheater",
                    EventCategory.CULTURAL,
                    false
            )
    );

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @PostConstruct
    @Transactional
    public void seedIfEmpty() {
        if (eventRepository.count() == 0) {
            eventRepository.saveAll(SEED_EVENTS.stream().map(EventEntity::fromDomain).toList());
        }
    }

    public List<Event> listEvents(String category, LocalDate dateFrom, LocalDate dateTo, String query) {
        String normalizedQuery = query == null ? null : query.toLowerCase(Locale.ROOT).trim();

        return eventRepository.findAll().stream()
                .map(EventEntity::toDomain)
                .filter(event -> category == null || event.category().getLabel().equalsIgnoreCase(category))
                .filter(event -> dateFrom == null || !event.date().isBefore(dateFrom))
                .filter(event -> dateTo == null || !event.date().isAfter(dateTo))
                .filter(event -> normalizedQuery == null || normalizedQuery.isBlank() || matchesQuery(event, normalizedQuery))
                .sorted(Comparator.comparing(Event::date).thenComparing(Event::time))
                .toList();
    }

    public Optional<Event> getById(String id) {
        return eventRepository.findById(id).map(EventEntity::toDomain);
    }

    @Transactional
    public Event createEvent(Event event) {
        EventEntity saved = eventRepository.save(EventEntity.fromDomain(event));
        return saved.toDomain();
    }

    @Transactional
    public Event updateEvent(String id, Event event) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found");
        }
        EventEntity saved = eventRepository.save(EventEntity.fromDomain(event));
        return saved.toDomain();
    }

    @Transactional
    public void deleteEvent(String id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found");
        }
        eventRepository.deleteById(id);
    }

    public String newEventId() {
        return UUID.randomUUID().toString();
    }

    public List<String> listCategories() {
        return eventRepository.findAll().stream()
                .map(EventEntity::toDomain)
                .map(event -> event.category().getLabel())
                .distinct()
                .sorted()
                .toList();
    }

    private boolean matchesQuery(Event event, String query) {
        return event.title().toLowerCase(Locale.ROOT).contains(query)
                || event.description().toLowerCase(Locale.ROOT).contains(query)
                || event.location().toLowerCase(Locale.ROOT).contains(query)
                || event.category().getLabel().toLowerCase(Locale.ROOT).contains(query);
    }
}
