package com.unievents.backend.auth.model;

/**
 * Roles that a user can hold in the system.
 * <ul>
 *   <li>STUDENT – can browse and register for events</li>
 *   <li>ORGANIZER – can create and manage events</li>
 *   <li>ADMIN – has full administrative access</li>
 * </ul>
 */
public enum UserRole {
    STUDENT,
    ORGANIZER,
    ADMIN
}
