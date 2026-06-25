export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface User {
  id_user: number;
  username: string;
  type: 'ADMIN' | 'WORKER';
}

export interface Owner {
  id_owner: number;
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
  address: string;
}

export interface Pet {
  id_pet: number;
  owner: Owner;
  name: string;
  species: string;
  race: string;
  birthdate: string;
  sex: 'MALE' | 'FEMALE';
  weight: string;
}

export interface Veterinarian {
  id_veterinarian: number;
  user: User;
  names: string;
  last_names: string;
  number_license: string;
  specialty: string;
  email: string;
  phone_number: string;
}

export interface Receptionist {
  id_receptionist: number;
  user: User;
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
}

export interface Appointment {
  id_appointment: number;
  receptionist: Receptionist;
  pet: Pet;
  veterinarian: Veterinarian;
  date: string;
  time_minutes: number;
  reason: string;
  notes: string;
  status: 'OPENED' | 'CLOSED' | 'CANCELED' | 'RESCHEDULED';
}

export interface MedicalHistory {
  id_medical_history: number;
  appointment: Appointment;
  services: Services;
  description: string;
  date: string;
}

export interface Vaccine {
  id_vaccine: number;
  name: string;
  description: string;
  manufacturer: string;
  required_dose: number;
}

export interface Vaccination {
  id_vaccination: number;
  medical_history: MedicalHistory;
  vaccine: Vaccine;
  application_date: string;
  next_application_date: string;
  observation: string;
}

export interface Services {
  id_service: number;
  name: string;
  description: string;
  price: number;
}

export type AppointmentStatus = 'OPENED' | 'CLOSED' | 'CANCELED' | 'RESCHEDULED';
export type UserType = 'ADMIN' | 'WORKER';
export type Sex = 'MALE' | 'FEMALE';
