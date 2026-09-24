package com.unievents.backend.auth.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @Column(nullable = false, updatable = false)
    private String id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String fullName;

    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    protected UserEntity() {
        // Required by JPA
    }

    public UserEntity(String id, String email, String fullName, String password, UserRole role,
                      LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static UserEntity fromDomain(User user) {
        return new UserEntity(
                user.id(),
                user.email(),
                user.fullName(),
                user.password(),
                user.role(),
                user.createdAt(),
                user.updatedAt()
        );
    }

    public User toDomain() {
        return new User(id, email, fullName, password, role, createdAt, updatedAt);
    }

    // Getters for JPA
    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPassword() {
        return password;
    }

    public UserRole getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}

