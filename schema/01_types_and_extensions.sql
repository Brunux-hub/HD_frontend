-- ============================================================================
-- HEALTHY PETS - VETERINARY CLINIC DATABASE SCHEMA
-- File: 01_types_and_extensions.sql
-- Description: PostgreSQL extensions and customized ENUM definitions.
-- ============================================================================

-- Enable essential extensions for cryptographic functions and UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUM: user_type_enum
-- Represents top-level account categorization in the frontend: ADMIN vs WORKER
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type_enum') THEN
        CREATE TYPE user_type_enum AS ENUM ('ADMIN', 'WORKER');
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2. ENUM: staff_role_enum
-- Fine-grained system roles returned by /auth/me for UI navigation and RLS authorization
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'staff_role_enum') THEN
        CREATE TYPE staff_role_enum AS ENUM ('ADMIN', 'VETERINARIAN', 'RECEPTIONIST', 'CLIENT', 'WORKER');
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 3. ENUM: pet_gender_enum
-- Animal gender classification matching the frontend specification
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pet_gender_enum') THEN
        CREATE TYPE pet_gender_enum AS ENUM ('MALE', 'FEMALE');
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 4. ENUM: appointment_status_enum
-- Appointment lifecycle management states
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status_enum') THEN
        CREATE TYPE appointment_status_enum AS ENUM ('OPENED', 'CLOSED', 'CANCELED', 'RESCHEDULED');
    END IF;
END $$;
