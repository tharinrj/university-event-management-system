CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE events ADD COLUMN IF NOT EXISTS category VARCHAR(50);

DO $$
BEGIN
    IF to_regclass('event_categories') IS NOT NULL
        AND to_regclass('categories') IS NOT NULL THEN
        UPDATE events e
        SET category = CASE regexp_replace(lower(c.name), '[^a-z0-9]+', '_', 'g')
            WHEN 'hackathon' THEN 'HACKATHON'
            WHEN 'guest_lecture' THEN 'GUEST_LECTURE'
            WHEN 'workshop' THEN 'WORKSHOP'
            WHEN 'club_fair' THEN 'CLUB_FAIR'
            WHEN 'networking' THEN 'NETWORKING'
            WHEN 'cultural' THEN 'CULTURAL'
            ELSE 'WORKSHOP'
        END
        FROM event_categories ec
        JOIN categories c ON c.category_id = ec.category_id
        WHERE e.event_id = ec.event_id
          AND e.category IS NULL;
    END IF;
END $$;

UPDATE events SET category = 'WORKSHOP' WHERE category IS NULL;
ALTER TABLE events ALTER COLUMN category SET DEFAULT 'WORKSHOP';
ALTER TABLE events ALTER COLUMN category SET NOT NULL;

ALTER TABLE events ADD COLUMN IF NOT EXISTS featured BOOLEAN;
UPDATE events SET featured = FALSE WHERE featured IS NULL;
ALTER TABLE events ALTER COLUMN featured SET DEFAULT FALSE;
ALTER TABLE events ALTER COLUMN featured SET NOT NULL;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'events'
          AND column_name = 'event_date'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'events'
          AND column_name = 'date'
    ) THEN
        ALTER TABLE events RENAME COLUMN event_date TO date;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'events'
          AND column_name = 'event_time'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'events'
          AND column_name = 'time'
    ) THEN
        ALTER TABLE events RENAME COLUMN event_time TO time;
    END IF;
END $$;

ALTER TABLE IF EXISTS events DROP CONSTRAINT IF EXISTS fk_event_creator;
ALTER TABLE IF EXISTS registrations DROP CONSTRAINT IF EXISTS fk_registration_user;
ALTER TABLE IF EXISTS registrations DROP CONSTRAINT IF EXISTS fk_registration_event;
ALTER TABLE IF EXISTS event_categories DROP CONSTRAINT IF EXISTS fk_ec_event;
ALTER TABLE IF EXISTS event_categories DROP CONSTRAINT IF EXISTS fk_ec_category;
ALTER TABLE IF EXISTS user_departments DROP CONSTRAINT IF EXISTS fk_ud_user;
ALTER TABLE IF EXISTS user_departments DROP CONSTRAINT IF EXISTS fk_ud_department;
ALTER TABLE IF EXISTS announcements DROP CONSTRAINT IF EXISTS fk_announcement_event;
ALTER TABLE IF EXISTS feedback DROP CONSTRAINT IF EXISTS fk_feedback_user;
ALTER TABLE IF EXISTS feedback DROP CONSTRAINT IF EXISTS fk_feedback_event;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'users'
          AND column_name = 'user_id'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'users'
          AND column_name = 'id'
    ) THEN
        ALTER TABLE users RENAME COLUMN user_id TO id;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'users'
          AND column_name = 'name'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'users'
          AND column_name = 'full_name'
    ) THEN
        ALTER TABLE users RENAME COLUMN name TO full_name;
    END IF;
END $$;

ALTER TABLE events ALTER COLUMN event_id DROP DEFAULT;
ALTER TABLE events ALTER COLUMN event_id TYPE VARCHAR(255) USING event_id::text;
ALTER TABLE events ALTER COLUMN event_id SET DEFAULT uuid_generate_v4()::text;

ALTER TABLE IF EXISTS registrations ALTER COLUMN event_id TYPE VARCHAR(255) USING event_id::text;
ALTER TABLE IF EXISTS event_categories ALTER COLUMN event_id TYPE VARCHAR(255) USING event_id::text;
ALTER TABLE IF EXISTS announcements ALTER COLUMN event_id TYPE VARCHAR(255) USING event_id::text;
ALTER TABLE IF EXISTS feedback ALTER COLUMN event_id TYPE VARCHAR(255) USING event_id::text;

UPDATE events SET description = 'No description provided.' WHERE description IS NULL;
ALTER TABLE events ALTER COLUMN description SET NOT NULL;

UPDATE events SET location = 'TBD' WHERE location IS NULL;
ALTER TABLE events ALTER COLUMN location SET NOT NULL;

ALTER TABLE users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE users ALTER COLUMN id TYPE VARCHAR(255) USING id::text;
ALTER TABLE users ALTER COLUMN id SET DEFAULT uuid_generate_v4()::text;
ALTER TABLE users ALTER COLUMN full_name TYPE VARCHAR(255);
ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(255);

ALTER TABLE IF EXISTS registrations ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::text;
ALTER TABLE IF EXISTS user_departments ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::text;
ALTER TABLE IF EXISTS feedback ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::text;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'events'
          AND column_name = 'created_by'
    ) THEN
        ALTER TABLE events ALTER COLUMN created_by DROP NOT NULL;
        ALTER TABLE events ALTER COLUMN created_by TYPE VARCHAR(255) USING created_by::text;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'users'
          AND column_name = 'role'
    ) THEN
        ALTER TABLE users ALTER COLUMN role SET DEFAULT 'student';
    END IF;
END $$;

ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
UPDATE users SET updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP);
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;

UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;
ALTER TABLE users ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ALTER COLUMN created_at SET NOT NULL;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'events'
          AND column_name = 'created_by'
    ) THEN
        ALTER TABLE events
            ADD CONSTRAINT fk_event_creator
            FOREIGN KEY (created_by)
            REFERENCES users(id)
            ON DELETE SET NULL;
    END IF;

    IF to_regclass('registrations') IS NOT NULL THEN
        ALTER TABLE registrations
            ADD CONSTRAINT fk_registration_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE;

        ALTER TABLE registrations
            ADD CONSTRAINT fk_registration_event
            FOREIGN KEY (event_id)
            REFERENCES events(event_id)
            ON DELETE CASCADE;
    END IF;

    IF to_regclass('event_categories') IS NOT NULL THEN
        ALTER TABLE event_categories
            ADD CONSTRAINT fk_ec_event
            FOREIGN KEY (event_id)
            REFERENCES events(event_id)
            ON DELETE CASCADE;

        ALTER TABLE event_categories
            ADD CONSTRAINT fk_ec_category
            FOREIGN KEY (category_id)
            REFERENCES categories(category_id)
            ON DELETE CASCADE;
    END IF;

    IF to_regclass('user_departments') IS NOT NULL THEN
        ALTER TABLE user_departments
            ADD CONSTRAINT fk_ud_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE;

        ALTER TABLE user_departments
            ADD CONSTRAINT fk_ud_department
            FOREIGN KEY (department_id)
            REFERENCES departments(department_id)
            ON DELETE CASCADE;
    END IF;

    IF to_regclass('announcements') IS NOT NULL THEN
        ALTER TABLE announcements
            ADD CONSTRAINT fk_announcement_event
            FOREIGN KEY (event_id)
            REFERENCES events(event_id)
            ON DELETE CASCADE;
    END IF;

    IF to_regclass('feedback') IS NOT NULL THEN
        ALTER TABLE feedback
            ADD CONSTRAINT fk_feedback_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE;

        ALTER TABLE feedback
            ADD CONSTRAINT fk_feedback_event
            FOREIGN KEY (event_id)
            REFERENCES events(event_id)
            ON DELETE CASCADE;
    END IF;
END $$;
