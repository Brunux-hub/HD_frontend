-- ============================================================================
-- HEALTHY PETS - VETERINARY CLINIC DATABASE SCHEMA
-- File: 03_indexes.sql
-- Description: Strategic B-Tree indexes for high-throughput queries and joins.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Users Indexes
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_type ON users (type);

-- ----------------------------------------------------------------------------
-- 2. Owners Indexes
-- Optimized for GET /owner/me and GET /owner/dni/:dni
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_owners_id_user ON owners (id_user);
CREATE INDEX IF NOT EXISTS idx_owners_dni ON owners (dni);
CREATE INDEX IF NOT EXISTS idx_owners_names ON owners (names, last_names);

-- ----------------------------------------------------------------------------
-- 3. Receptionists & Veterinarians Indexes
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_receptionists_id_user ON receptionists (id_user);
CREATE INDEX IF NOT EXISTS idx_veterinarians_id_user ON veterinarians (id_user);
CREATE INDEX IF NOT EXISTS idx_veterinarians_license ON veterinarians (number_license);

-- ----------------------------------------------------------------------------
-- 4. Pets Indexes
-- Speeds up retrieval of pets by owner and species categorization
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_pets_id_owner ON pets (id_owner);
CREATE INDEX IF NOT EXISTS idx_pets_species ON pets (species);
CREATE INDEX IF NOT EXISTS idx_pets_name ON pets (name);

-- ----------------------------------------------------------------------------
-- 5. Appointments Indexes
-- Essential for calendar schedules, doctor agendas, and status reports
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_appointments_date_vet ON appointments (date, id_veterinarian);
CREATE INDEX IF NOT EXISTS idx_appointments_id_pet ON appointments (id_pet);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments (status);
CREATE INDEX IF NOT EXISTS idx_appointments_id_receptionist ON appointments (id_receptionist);

-- ----------------------------------------------------------------------------
-- 6. Medical Histories Indexes
-- Quick lookup by appointment and service
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_medical_histories_id_app ON medical_histories (id_appointment);
CREATE INDEX IF NOT EXISTS idx_medical_histories_id_svc ON medical_histories (id_service);
CREATE INDEX IF NOT EXISTS idx_medical_histories_date ON medical_histories (date);

-- ----------------------------------------------------------------------------
-- 7. Vaccinations Indexes
-- Accelerates client portal vaccination book and booster expiration alerts
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_vaccinations_history ON vaccinations (id_medical_history);
CREATE INDEX IF NOT EXISTS idx_vaccinations_vaccine ON vaccinations (id_vaccine);
CREATE INDEX IF NOT EXISTS idx_vaccinations_next_dose ON vaccinations (next_application_date);
