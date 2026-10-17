-- ============================================================================
-- HEALTHY PETS - MASTER DATABASE INITIALIZATION SCRIPT
-- File: apply_all.sql
-- Description: Runs all schema definitions, constraints, indexes, triggers,
--              RLS policies, and seed data in the strict required sequence.
-- ============================================================================

\echo '>>> Initializing Healthy Pets Database...'

\echo '1/6. Creating extensions and custom ENUM types...'
\i 01_types_and_extensions.sql

\echo '2/6. Creating core tables and constraints...'
\i 02_tables.sql

\echo '3/6. Creating strategic performance indexes...'
\i 03_indexes.sql

\echo '4/6. Setting up automated timestamp triggers...'
\i 04_triggers.sql

\echo '5/6. Configuring Row Level Security (RLS) policies...'
\i 05_rls_policies.sql

\echo '6/6. Populating database with realistic seed data...'
\i 06_seed_initial.sql

\echo '>>> Healthy Pets Database initialization completed successfully!'
