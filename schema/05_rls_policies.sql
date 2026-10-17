-- ============================================================================
-- HEALTHY PETS - VETERINARY CLINIC DATABASE SCHEMA
-- File: 05_rls_policies.sql
-- Description: Row Level Security (RLS) policies for Supabase & PostgreSQL.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Helper Functions to extract JWT claims safely
-- ----------------------------------------------------------------------------

-- Extract authenticated user's role from JWT (compatible with Supabase Auth & custom JWT)
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
    SELECT COALESCE(
        current_setting('request.jwt.claims', true)::jsonb ->> 'role',
        current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role',
        'ANON'
    );
$$;

-- Extract authenticated user's id_user from JWT
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS integer
LANGUAGE sql
STABLE
AS $$
    SELECT NULLIF(
        COALESCE(
            current_setting('request.jwt.claims', true)::jsonb ->> 'id_user',
            current_setting('request.jwt.claims', true)::jsonb ->> 'sub'
        ), ''
    )::integer;
$$;

-- ----------------------------------------------------------------------------
-- 2. Enable Row Level Security on all core business tables
-- ----------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE receptionists ENABLE ROW LEVEL SECURITY;
ALTER TABLE veterinarians ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 3. USERS Table Policies
-- ----------------------------------------------------------------------------
-- Admins have full access
CREATE POLICY p_users_admin ON users
    FOR ALL
    USING (current_user_role() = 'ADMIN');

-- Users can read their own account
CREATE POLICY p_users_self_read ON users
    FOR SELECT
    USING (id_user = current_user_id());

-- Allow public registration (service role or anon for register endpoint)
CREATE POLICY p_users_insert_anon ON users
    FOR INSERT
    WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 4. SERVICES & VACCINES Catalog Policies (Public Read, Admin/Staff Write)
-- ----------------------------------------------------------------------------
CREATE POLICY p_services_read_all ON services
    FOR SELECT
    USING (true);

CREATE POLICY p_services_write_admin ON services
    FOR ALL
    USING (current_user_role() IN ('ADMIN', 'VETERINARIAN'));

CREATE POLICY p_vaccines_read_all ON vaccines
    FOR SELECT
    USING (true);

CREATE POLICY p_vaccines_write_admin ON vaccines
    FOR ALL
    USING (current_user_role() IN ('ADMIN', 'VETERINARIAN'));

-- ----------------------------------------------------------------------------
-- 5. OWNERS Table Policies
-- ----------------------------------------------------------------------------
-- Staff can view and manage all owners
CREATE POLICY p_owners_staff ON owners
    FOR ALL
    USING (current_user_role() IN ('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER'));

-- Clients can only read their own profile
CREATE POLICY p_owners_client_read ON owners
    FOR SELECT
    USING (id_user = current_user_id());

-- Clients can update their own phone or address
CREATE POLICY p_owners_client_update ON owners
    FOR UPDATE
    USING (id_user = current_user_id());

-- Allow public registration insertion
CREATE POLICY p_owners_insert ON owners
    FOR INSERT
    WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 6. PETS Table Policies
-- ----------------------------------------------------------------------------
-- Staff can manage all pets
CREATE POLICY p_pets_staff ON pets
    FOR ALL
    USING (current_user_role() IN ('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER'));

-- Clients can only see their own pets
CREATE POLICY p_pets_client_read ON pets
    FOR SELECT
    USING (
        id_owner IN (SELECT id_owner FROM owners WHERE id_user = current_user_id())
    );

-- ----------------------------------------------------------------------------
-- 7. APPOINTMENTS Table Policies
-- ----------------------------------------------------------------------------
-- Staff can manage appointments
CREATE POLICY p_appointments_staff ON appointments
    FOR ALL
    USING (current_user_role() IN ('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER'));

-- Clients can view appointments for their own pets
CREATE POLICY p_appointments_client_read ON appointments
    FOR SELECT
    USING (
        id_pet IN (
            SELECT p.id_pet FROM pets p
            JOIN owners o ON p.id_owner = o.id_owner
            WHERE o.id_user = current_user_id()
        )
    );

-- ----------------------------------------------------------------------------
-- 8. MEDICAL HISTORIES Table Policies
-- ----------------------------------------------------------------------------
-- Vets and Admins can create and edit medical histories
CREATE POLICY p_medical_histories_vets ON medical_histories
    FOR ALL
    USING (current_user_role() IN ('ADMIN', 'VETERINARIAN'));

-- Receptionists and workers can read
CREATE POLICY p_medical_histories_staff_read ON medical_histories
    FOR SELECT
    USING (current_user_role() IN ('RECEPTIONIST', 'WORKER'));

-- Clients can view medical histories of their own pets
CREATE POLICY p_medical_histories_client_read ON medical_histories
    FOR SELECT
    USING (
        id_appointment IN (
            SELECT a.id_appointment FROM appointments a
            JOIN pets p ON a.id_pet = p.id_pet
            JOIN owners o ON p.id_owner = o.id_owner
            WHERE o.id_user = current_user_id()
        )
    );

-- ----------------------------------------------------------------------------
-- 9. VACCINATIONS Table Policies
-- ----------------------------------------------------------------------------
-- Vets and Admins can manage vaccinations
CREATE POLICY p_vaccinations_vets ON vaccinations
    FOR ALL
    USING (current_user_role() IN ('ADMIN', 'VETERINARIAN'));

-- Receptionists can view vaccinations
CREATE POLICY p_vaccinations_staff_read ON vaccinations
    FOR SELECT
    USING (current_user_role() IN ('RECEPTIONIST', 'WORKER'));

-- Clients can view vaccinations of their own pets
CREATE POLICY p_vaccinations_client_read ON vaccinations
    FOR SELECT
    USING (
        id_medical_history IN (
            SELECT mh.id_medical_history FROM medical_histories mh
            JOIN appointments a ON mh.id_appointment = a.id_appointment
            JOIN pets p ON a.id_pet = p.id_pet
            JOIN owners o ON p.id_owner = o.id_owner
            WHERE o.id_user = current_user_id()
        )
    );

-- ----------------------------------------------------------------------------
-- 10. RECEPTIONISTS & VETERINARIANS Staff Profiles
-- ----------------------------------------------------------------------------
CREATE POLICY p_receptionists_read_all ON receptionists
    FOR SELECT
    USING (true);

CREATE POLICY p_receptionists_admin_write ON receptionists
    FOR ALL
    USING (current_user_role() = 'ADMIN');

CREATE POLICY p_veterinarians_read_all ON veterinarians
    FOR SELECT
    USING (true);

CREATE POLICY p_veterinarians_admin_write ON veterinarians
    FOR ALL
    USING (current_user_role() = 'ADMIN');
