-- ============================================================================
-- HEALTHY PETS - VETERINARY CLINIC DATABASE SCHEMA
-- File: 06_seed_initial.sql
-- Description: Realistic initial data for testing, local DB setup, and Supabase.
-- Note: Passwords are encrypted with bcrypt ($2a$10$... -> 'password123')
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Insert Initial Users
-- Password for all seed users is 'password123'
-- ----------------------------------------------------------------------------
INSERT INTO users (id_user, username, password, type, role) VALUES
(1, 'admin', '$2b$10$wK2Vv7f9gMtwgK2WqO6aE.93p.yZg6Jt6VzIeZqjG7M2aXm3i3F1q', 'ADMIN', 'ADMIN'),
(2, 'vet_alejandro', '$2b$10$wK2Vv7f9gMtwgK2WqO6aE.93p.yZg6Jt6VzIeZqjG7M2aXm3i3F1q', 'WORKER', 'VETERINARIAN'),
(3, 'vet_lucia', '$2b$10$wK2Vv7f9gMtwgK2WqO6aE.93p.yZg6Jt6VzIeZqjG7M2aXm3i3F1q', 'WORKER', 'VETERINARIAN'),
(4, 'recep_maria', '$2b$10$wK2Vv7f9gMtwgK2WqO6aE.93p.yZg6Jt6VzIeZqjG7M2aXm3i3F1q', 'WORKER', 'RECEPTIONIST'),
(5, 'client_carlos', '$2b$10$wK2Vv7f9gMtwgK2WqO6aE.93p.yZg6Jt6VzIeZqjG7M2aXm3i3F1q', 'WORKER', 'CLIENT')
ON CONFLICT (id_user) DO NOTHING;

SELECT setval('users_id_user_seq', (SELECT MAX(id_user) FROM users));

-- ----------------------------------------------------------------------------
-- 2. Insert Staff Profiles
-- ----------------------------------------------------------------------------
INSERT INTO receptionists (id_receptionist, id_user, names, last_names, email, phone_number) VALUES
(1, 4, 'Maria', 'Solis Perez', 'maria.solis@healthypets.com', '+51 987654321')
ON CONFLICT (id_receptionist) DO NOTHING;

SELECT setval('receptionists_id_receptionist_seq', (SELECT MAX(id_receptionist) FROM receptionists));

INSERT INTO veterinarians (id_veterinarian, id_user, names, last_names, number_license, specialty, email, phone_number) VALUES
(1, 2, 'Alejandro', 'Martinez Ruiz', 'CMVP-10293', 'General Medicine', 'alejandro.martinez@healthypets.com', '+51 912345678'),
(2, 3, 'Lucia', 'Fernandez Lopez', 'CMVP-20481', 'Surgery & Orthopedics', 'lucia.fernandez@healthypets.com', '+51 923456789')
ON CONFLICT (id_veterinarian) DO NOTHING;

SELECT setval('veterinarians_id_veterinarian_seq', (SELECT MAX(id_veterinarian) FROM veterinarians));

-- ----------------------------------------------------------------------------
-- 3. Insert Catalog Services
-- ----------------------------------------------------------------------------
INSERT INTO services (id_service, name, description, price) VALUES
(1, 'General Consultation', 'Complete medical checkup, vital signs, physical exam and preventive diagnosis.', 45.00),
(2, 'Veterinary Surgery', 'Surgical procedures performed under inhaled anesthesia and vital monitoring.', 250.00),
(3, 'Vaccination and Deworming', 'Immunization plan, rabies/hexavalent boosters, and internal/external antiparasitics.', 35.00),
(4, 'Clinical Laboratory', 'Comprehensive blood biochemistry, hemogram, urinalysis, and microscopic cytology.', 70.00),
(5, 'Canine & Feline Odontology', 'Ultrasonic dental scaling, prophylaxis, and oral hygiene assessment.', 85.00),
(6, '24/7 Emergency Care', 'Immediate triage and resuscitation for traumatic injuries and critical poisoning.', 120.00)
ON CONFLICT (id_service) DO NOTHING;

SELECT setval('services_id_service_seq', (SELECT MAX(id_service) FROM services));

-- ----------------------------------------------------------------------------
-- 4. Insert Catalog Vaccines
-- ----------------------------------------------------------------------------
INSERT INTO vaccines (id_vaccine, name, description, manufacturer, required_dose) VALUES
(1, 'Rabies Rabisin', 'Inactivated rabies virus vaccine for dogs and cats.', 'Boehringer Ingelheim', 1),
(2, 'Canine Sextuple (DHPPi/L)', 'Protection against Distemper, Hepatitis, Parvovirus, Parainfluenza and Leptospirosis.', 'Zoetis (Vanguard Plus 5)', 3),
(3, 'Feline Triple (FVRCP)', 'Protection against Rhinotracheitis, Calicivirus and Panleukopenia in cats.', 'Merck Animal Health (Nobivac)', 2),
(4, 'Kennel Cough (Bordetella)', 'Intranasal/Subcutaneous vaccine against infectious tracheobronchitis.', 'Zoetis (Bronchicine)', 1)
ON CONFLICT (id_vaccine) DO NOTHING;

SELECT setval('vaccines_id_vaccine_seq', (SELECT MAX(id_vaccine) FROM vaccines));

-- ----------------------------------------------------------------------------
-- 5. Insert Owners
-- ----------------------------------------------------------------------------
INSERT INTO owners (id_owner, id_user, dni, names, last_names, email, phone_number, address) VALUES
(1, 5, '72849102', 'Carlos', 'Mendoza Vargas', 'carlos.mendoza@gmail.com', '+51 998877665', 'Av. Primavera 452, Santiago de Surco, Lima'),
(2, NULL, '45892103', 'Valeria', 'Torres Quiroz', 'valeria.torres@hotmail.com', '+51 977665544', 'Calle Los Sauces 120, Miraflores, Lima')
ON CONFLICT (id_owner) DO NOTHING;

SELECT setval('owners_id_owner_seq', (SELECT MAX(id_owner) FROM owners));

-- ----------------------------------------------------------------------------
-- 6. Insert Pets
-- ----------------------------------------------------------------------------
INSERT INTO pets (id_pet, id_owner, name, species, race, birthdate, pet_gender, weight) VALUES
(1, 1, 'Max', 'Canine', 'Golden Retriever', '2021-05-14', 'MALE', '28.5 kg'),
(2, 1, 'Luna', 'Feline', 'Siamese', '2022-09-20', 'FEMALE', '4.2 kg'),
(3, 2, 'Rocky', 'Canine', 'French Bulldog', '2023-01-10', 'MALE', '11.8 kg')
ON CONFLICT (id_pet) DO NOTHING;

SELECT setval('pets_id_pet_seq', (SELECT MAX(id_pet) FROM pets));

-- ----------------------------------------------------------------------------
-- 7. Insert Appointments
-- ----------------------------------------------------------------------------
INSERT INTO appointments (id_appointment, id_receptionist, id_pet, id_veterinarian, date, time_minutes, reason, notes, status) VALUES
(1, 1, 1, 1, '2026-10-10 10:00:00+00', 30, 'Annual vaccination and general checkup', 'Owner reports good appetite and normal activity.', 'CLOSED'),
(2, 1, 2, 2, '2026-10-12 11:30:00+00', 45, 'Skin scratching and slight alopecia on flank', 'Possible allergic dermatitis.', 'CLOSED'),
(3, 1, 3, 1, '2026-10-25 15:00:00+00', 30, 'Scheduled routine vaccination booster', 'Verify ear canal cleanliness.', 'OPENED')
ON CONFLICT (id_appointment) DO NOTHING;

SELECT setval('appointments_id_appointment_seq', (SELECT MAX(id_appointment) FROM appointments));

-- ----------------------------------------------------------------------------
-- 8. Insert Medical Histories
-- ----------------------------------------------------------------------------
INSERT INTO medical_histories (id_medical_history, id_appointment, id_service, description, date) VALUES
(1, 1, 3, 'Patient presented in optimal nutritional condition. Heart rate: 95 bpm, Temp: 38.4C. Administered annual Rabies and Hexavalent vaccine.', '2026-10-10 10:30:00+00'),
(2, 2, 1, 'Clinical exam shows localized mild erythema in left lateral abdomen. Skin scrape negative for mites. Prescribed hypoallergenic shampoo and Apoquel.', '2026-10-12 12:15:00+00')
ON CONFLICT (id_medical_history) DO NOTHING;

SELECT setval('medical_histories_id_medical_history_seq', (SELECT MAX(id_medical_history) FROM medical_histories));

-- ----------------------------------------------------------------------------
-- 9. Insert Vaccinations
-- ----------------------------------------------------------------------------
INSERT INTO vaccinations (id_vaccination, id_medical_history, id_vaccine, application_date, next_application_date, observation) VALUES
(1, 1, 1, '2026-10-10 10:30:00+00', '2027-10-10 10:30:00+00', 'No adverse reaction observed after 15 min rest.'),
(2, 1, 2, '2026-10-10 10:35:00+00', '2027-10-10 10:35:00+00', 'Annual booster applied subcutaneously.')
ON CONFLICT (id_vaccination) DO NOTHING;

SELECT setval('vaccinations_id_vaccination_seq', (SELECT MAX(id_vaccination) FROM vaccinations));
