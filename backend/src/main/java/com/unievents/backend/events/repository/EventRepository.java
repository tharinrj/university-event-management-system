package com.unievents.backend.events.repository;

import com.unievents.backend.events.model.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<EventEntity, String> {
}

