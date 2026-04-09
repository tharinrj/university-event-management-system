-- =========================
-- EXTENSIONS
-- =========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE users (
                       user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(150) UNIQUE NOT NULL,
                       password TEXT NOT NULL,
                       role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'organizer', 'admin')),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- EVENTS TABLE
-- =========================
CREATE TABLE events (
                        event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        title VARCHAR(200) NOT NULL,
                        description TEXT,
                        event_date DATE NOT NULL,
                        event_time TIME NOT NULL,
                        location VARCHAR(200),
                        capacity INT CHECK (capacity > 0),
                        created_by UUID NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                        CONSTRAINT fk_event_creator
                            FOREIGN KEY (created_by)
                                REFERENCES users(user_id)
                                ON DELETE CASCADE
);

-- =========================
-- REGISTRATIONS TABLE
-- =========================
CREATE TABLE registrations (
                               registration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               user_id UUID NOT NULL,
                               event_id UUID NOT NULL,
                               registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               status VARCHAR(20) DEFAULT 'registered'
                                   CHECK (status IN ('registered', 'cancelled', 'attended')),

                               CONSTRAINT fk_registration_user
                                   FOREIGN KEY (user_id)
                                       REFERENCES users(user_id)
                                       ON DELETE CASCADE,

                               CONSTRAINT fk_registration_event
                                   FOREIGN KEY (event_id)
                                       REFERENCES events(event_id)
                                       ON DELETE CASCADE,

                               CONSTRAINT unique_user_event
                                   UNIQUE (user_id, event_id)
);

-- =========================
-- DEPARTMENTS TABLE
-- =========================
CREATE TABLE departments (
                             department_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                             name VARCHAR(100) UNIQUE NOT NULL
);

-- =========================
-- USER-DEPARTMENT MAPPING
-- =========================
CREATE TABLE user_departments (
                                  user_id UUID NOT NULL,
                                  department_id UUID NOT NULL,

                                  PRIMARY KEY (user_id, department_id),

                                  CONSTRAINT fk_ud_user
                                      FOREIGN KEY (user_id)
                                          REFERENCES users(user_id)
                                          ON DELETE CASCADE,

                                  CONSTRAINT fk_ud_department
                                      FOREIGN KEY (department_id)
                                          REFERENCES departments(department_id)
                                          ON DELETE CASCADE
);

-- =========================
-- CATEGORIES TABLE
-- =========================
CREATE TABLE categories (
                            category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                            name VARCHAR(100) UNIQUE NOT NULL
);

-- =========================
-- EVENT-CATEGORY MAPPING
-- =========================
CREATE TABLE event_categories (
                                  event_id UUID NOT NULL,
                                  category_id UUID NOT NULL,

                                  PRIMARY KEY (event_id, category_id),

                                  CONSTRAINT fk_ec_event
                                      FOREIGN KEY (event_id)
                                          REFERENCES events(event_id)
                                          ON DELETE CASCADE,

                                  CONSTRAINT fk_ec_category
                                      FOREIGN KEY (category_id)
                                          REFERENCES categories(category_id)
                                          ON DELETE CASCADE
);

-- =========================
-- ANNOUNCEMENTS TABLE
-- =========================
CREATE TABLE announcements (
                               announcement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               event_id UUID NOT NULL,
                               message TEXT NOT NULL,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                               CONSTRAINT fk_announcement_event
                                   FOREIGN KEY (event_id)
                                       REFERENCES events(event_id)
                                       ON DELETE CASCADE
);

-- =========================
-- FEEDBACK TABLE
-- =========================
CREATE TABLE feedback (
                          feedback_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          user_id UUID NOT NULL,
                          event_id UUID NOT NULL,
                          rating INT CHECK (rating BETWEEN 1 AND 5),
                          comment TEXT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT fk_feedback_user
                              FOREIGN KEY (user_id)
                                  REFERENCES users(user_id)
                                  ON DELETE CASCADE,

                          CONSTRAINT fk_feedback_event
                              FOREIGN KEY (event_id)
                                  REFERENCES events(event_id)
                                  ON DELETE CASCADE,

                          CONSTRAINT unique_feedback
                              UNIQUE (user_id, event_id)
);

-- =========================
-- INDEXES (PERFORMANCE)
-- =========================
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_event ON registrations(event_id);