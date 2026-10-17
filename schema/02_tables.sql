-- ============================================================================
-- HEALTHY PETS - VETERINARY CLINIC DATABASE SCHEMA
-- File: 02_tables.sql
-- Description: Complete DDL with Primary Keys, Foreign Keys, Checks, and Defaults.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABLE: users
-- Represents login authentication accounts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id_user SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    type user_type_enum NOT NULL DEFAULT 'WORKER',
    role staff_role_enum NOT NULL DEFAULT 'CLIENT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. TABLE: owners
-- Pet owners (clients). Can be linked to a user account or created as walk-ins.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS owners (
    id_owner SERIAL PRIMARY KEY,
    id_user INT UNIQUE REFERENCES users(id_user) ON DELETE SET NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    names VARCHAR(100) NOT NULL,
    last_names VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_owner_dni_length CHECK (LENGTH(TRIM(dni)) >= 5)
);

-- ----------------------------------------------------------------------------
-- 3. TABLE: receptionists
-- Clinic administrative and front-desk staff
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS receptionists (
    id_receptionist SERIAL PRIMARY KEY,
    id_user INT NOT NULL UNIQUE REFERENCES users(id_user) ON DELETE CASCADE,
    names VARCHAR(100) NOT NULL,
    last_names VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. TABLE: veterinarians
-- Medical doctors and clinical specialists
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS veterinarians (
    id_veterinarian SERIAL PRIMARY KEY,
    id_user INT NOT NULL UNIQUE REFERENCES users(id_user) ON DELETE CASCADE,
    names VARCHAR(100) NOT NULL,
    last_names VARCHAR(100) NOT NULL,
    number_license VARCHAR(50) NOT NULL UNIQUE,
    specialty VARCHAR(100) NOT NULL DEFAULT 'General Medicine',
    email VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. TABLE: pets
-- Animal patients under veterinary care
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pets (
    id_pet SERIAL PRIMARY KEY,
    id_owner INT NOT NULL REFERENCES owners(id_owner) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    race VARCHAR(100) NOT NULL,
    birthdate DATE NOT NULL,
    pet_gender pet_gender_enum NOT NULL,
    weight VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_pet_birthdate_valid CHECK (birthdate <= CURRENT_DATE)
);

-- ----------------------------------------------------------------------------
-- 6. TABLE: services
-- Catalog of veterinary clinical and aesthetic services
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
    id_service SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_service_price_positive CHECK (price >= 0.00)
);

-- ----------------------------------------------------------------------------
-- 7. TABLE: appointments
-- Scheduled clinical consultations and procedures
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
    id_appointment SERIAL PRIMARY KEY,
    id_receptionist INT NOT NULL REFERENCES receptionists(id_receptionist) ON DELETE RESTRICT,
    id_pet INT NOT NULL REFERENCES pets(id_pet) ON DELETE CASCADE,
    id_veterinarian INT NOT NULL REFERENCES veterinarians(id_veterinarian) ON DELETE RESTRICT,
    date TIMESTAMPTZ NOT NULL,
    time_minutes INT NOT NULL DEFAULT 30,
    reason TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    status appointment_status_enum NOT NULL DEFAULT 'OPENED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_appointment_time_positive CHECK (time_minutes > 0)
);

-- ----------------------------------------------------------------------------
-- 8. TABLE: medical_histories
-- Clinical encounter examination records and diagnostic SOAP notes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medical_histories (
    id_medical_history SERIAL PRIMARY KEY,
    id_appointment INT NOT NULL UNIQUE REFERENCES appointments(id_appointment) ON DELETE CASCADE,
    id_service INT NOT NULL REFERENCES services(id_service) ON DELETE RESTRICT,
    description TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 9. TABLE: vaccines
-- Catalog of pharmaceutical immunization biologics
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vaccines (
    id_vaccine SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    manufacturer VARCHAR(100) NOT NULL,
    required_dose INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_vaccine_dose_positive CHECK (required_dose > 0)
);

-- ----------------------------------------------------------------------------
-- 10. TABLE: vaccinations
-- Administered vaccine doses tied to a medical consultation encounter
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vaccinations (
    id_vaccination SERIAL PRIMARY KEY,
    id_medical_history INT NOT NULL REFERENCES medical_histories(id_medical_history) ON DELETE CASCADE,
    id_vaccine INT NOT NULL REFERENCES vaccines(id_vaccine) ON DELETE RESTRICT,
    application_date TIMESTAMPTZ NOT NULL,
    next_application_date TIMESTAMPTZ,
    observation TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_vaccination_dates CHECK (
        next_application_date IS NULL OR next_application_date >= application_date
    )
);
