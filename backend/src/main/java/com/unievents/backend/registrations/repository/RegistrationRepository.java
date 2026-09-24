package com.unievents.backend.registrations.repository;

import com.unievents.backend.registrations.model.RegistrationEntity;
import com.unievents.backend.registrations.model.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<RegistrationEntity, String> {

    Optional<RegistrationEntity> findByUserIdAndEventId(String userId, String eventId);

    boolean existsByUserIdAndEventIdAndStatus(String userId, String eventId, RegistrationStatus status);

    long countByEventIdAndStatus(String eventId, RegistrationStatus status);
}
