ALTER TABLE users
    DROP CONSTRAINT IF EXISTS users_role_check;

-- 2. Ensure the role column exists.
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role VARCHAR(20);

-- 3. Convert existing role values to uppercase.
UPDATE users
SET role = UPPER(role)
WHERE role IS NOT NULL;

-- 4. Give any NULL roles a default value.
UPDATE users
SET role = 'STUDENT'
WHERE role IS NULL;

-- 5. Make role mandatory and set the default.
ALTER TABLE users
    ALTER COLUMN role SET NOT NULL;

ALTER TABLE users
    ALTER COLUMN role SET DEFAULT 'STUDENT';

-- 6. Remove the new constraint if it was partially created.
ALTER TABLE users
    DROP CONSTRAINT IF EXISTS chk_user_role;

-- 7. Add the uppercase constraint.
ALTER TABLE users
    ADD CONSTRAINT chk_user_role
    CHECK (role IN ('STUDENT', 'ORGANIZER', 'ADMIN'));

-- 8. Seed the default admin account.
--    V2 renamed: user_id → id, name → full_name, and added updated_at (NOT NULL).
--    Password is 'Admin@1234' (BCrypt hash – change in production!)
INSERT INTO users (
    id,
    full_name,
    email,
    password,
    role,
    created_at,
    updated_at
)
VALUES (
    uuid_generate_v4()::text,
    'System Admin',
    'admin@unievents.edu',
    '$2a$12$Y7n3BRz5WiEQIPgGy5Y1OuInVwRHXxuQGEcHr2gQM3v7cw2LhCY7a',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;