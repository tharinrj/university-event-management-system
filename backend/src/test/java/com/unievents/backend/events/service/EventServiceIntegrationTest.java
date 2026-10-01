package com.unievents.backend.events.service;

import com.unievents.backend.events.model.Event;
import com.unievents.backend.events.model.EventCategory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class EventServiceIntegrationTest {

    @Autowired
    private EventService eventService;

    @Test
    void shouldSeedAndReturnEvents() {
        List<Event> events = eventService.listEvents(null, null, null, null);

        assertThat(events).isNotEmpty();
        assertThat(eventService.getById("1")).isPresent();
        assertThat(eventService.listCategories()).isNotEmpty();
    }

    @Test
    void shouldCreateUpdateAndDeleteEvent() {
        String id = eventService.newEventId();
        Event created = eventService.createEvent(new Event(
                id,
                "Test Event",
                "Created from integration test",
                LocalDate.of(2026, 5, 1),
                LocalTime.of(10, 0),
                "Room A",
                EventCategory.WORKSHOP,
                false,
                null
        ));

        assertThat(eventService.getById(created.id())).isPresent();

        Event updated = eventService.updateEvent(created.id(), new Event(
                created.id(),
                "Updated Test Event",
                "Updated from integration test",
                LocalDate.of(2026, 5, 2),
                LocalTime.of(11, 0),
                "Room B",
                EventCategory.GUEST_LECTURE,
                true,
                null
        ));

        assertThat(updated.title()).isEqualTo("Updated Test Event");
        assertThat(eventService.getById(created.id())).isPresent();

        eventService.deleteEvent(created.id());
        assertThat(eventService.getById(created.id())).isEmpty();
    }
}
