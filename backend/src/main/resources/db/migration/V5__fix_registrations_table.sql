-- =========================
-- V5: Fix registrations table for JPA
-- =========================

-- 1. Uppercase existing status values (V1 stored lowercase)
UPDATE registrations SET status = UPPER(status) WHERE status IS NOT NULL;

-- 2. Drop the old lowercase status constraint
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_status_check;

-- 3. Add uppercase check constraint
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS chk_registration_status;
ALTER TABLE registrations ADD CONSTRAINT chk_registration_status
    CHECK (status IN ('REGISTERED', 'CANCELLED', 'ATTENDED'));

-- 4. Default new registrations to REGISTERED
ALTER TABLE registrations ALTER COLUMN status SET DEFAULT 'REGISTERED';
ALTER TABLE registrations ALTER COLUMN status SET NOT NULL;

-- 5. Convert registration_id to TEXT to match JPA String mapping
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS unique_user_event;
ALTER TABLE registrations ALTER COLUMN registration_id DROP DEFAULT;
ALTER TABLE registrations ALTER COLUMN registration_id TYPE VARCHAR(255) USING registration_id::text;
ALTER TABLE registrations ALTER COLUMN registration_id SET DEFAULT uuid_generate_v4()::text;

-- 6. Re-add unique constraint
ALTER TABLE registrations ADD CONSTRAINT unique_user_event UNIQUE (user_id, event_id);
