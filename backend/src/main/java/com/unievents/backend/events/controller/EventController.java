package com.unievents.backend.events.controller;

import com.unievents.backend.events.dto.EventCreateRequest;
import com.unievents.backend.events.dto.EventResponse;
import com.unievents.backend.events.dto.EventUpdateRequest;
import com.unievents.backend.events.model.Event;
import com.unievents.backend.events.service.EventService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Validated
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/events")
    public List<EventResponse> listEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false, name = "q") @Pattern(regexp = "^[\\p{L}\\p{N}\\s'&.,:-]*$", message = "Invalid search query") String query
    ) {
        return eventService.listEvents(category, dateFrom, dateTo, query)
                .stream()
                .map(EventResponse::from)
                .toList();
    }

    @GetMapping("/events/{id}")
    public EventResponse getEvent(@PathVariable String id) {
        return eventService.getById(id)
                .map(EventResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
    }

    @GetMapping("/events/categories")
    public List<String> listCategories() {
        return eventService.listCategories();
    }

    @GetMapping("/health")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @PostMapping("/events")
    @ResponseStatus(HttpStatus.CREATED)
    public EventResponse createEvent(@Valid @RequestBody EventCreateRequest request) {
        try {
            Event created = eventService.createEvent(new Event(
                    eventService.newEventId(),
                    request.title(),
                    request.description(),
                    request.date(),
                    request.time(),
                    request.location(),
                    request.parsedCategory(),
                    request.featured(),
                    request.createdBy()
            ));
            return EventResponse.from(created);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @PutMapping("/events/{id}")
    public EventResponse updateEvent(@PathVariable String id, @Valid @RequestBody EventUpdateRequest request) {
        try {
            // Preserve the original createdBy when updating
            String createdBy = eventService.getById(id).map(Event::createdBy).orElse(null);
            Event updated = eventService.updateEvent(id, new Event(
                    id,
                    request.title(),
                    request.description(),
                    request.date(),
                    request.time(),
                    request.location(),
                    request.parsedCategory(),
                    request.featured(),
                    createdBy
            ));
            return EventResponse.from(updated);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @DeleteMapping("/events/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
    }

    /** List all events created by a specific organizer. */
    @GetMapping("/users/{userId}/created-events")
    public List<EventResponse> getEventsByCreator(@PathVariable String userId) {
        return eventService.getEventsByCreator(userId)
                .stream()
                .map(EventResponse::from)
                .toList();
    }
}
