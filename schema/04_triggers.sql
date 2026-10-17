-- ============================================================================
-- HEALTHY PETS - VETERINARY CLINIC DATABASE SCHEMA
-- File: 04_triggers.sql
-- Description: Automated trigger functions for audit columns (updated_at).
-- ============================================================================

-- Generic trigger function to set updated_at to CURRENT_TIMESTAMP
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger across all tables having updated_at column
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'users',
        'owners',
        'receptionists',
        'veterinarians',
        'pets',
        'services',
        'appointments',
        'medical_histories',
        'vaccines',
        'vaccinations'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_set_updated_at ON %I;', tbl);
        EXECUTE format('
            CREATE TRIGGER trg_set_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION set_updated_at_timestamp();
        ', tbl);
    END LOOP;
END $$;
