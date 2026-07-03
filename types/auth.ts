import type { UserType } from "@/types/enums";

// POST /auth/login
export interface LoginRequest {
  username: string;
  password: string;
}

// Respuesta de /auth/login
export interface AuthResponse {
  token: string;
}

// Rol "fino" que devuelve el backend en GET /auth/me.
export type StaffRole =
  | "ADMIN"
  | "VETERINARIAN"
  | "RECEPTIONIST"
  | "CLIENT"
  | "WORKER";

// Respuesta de GET /auth/me
export interface MeResponse {
  username: string;
  role: StaffRole;
}

// POST /auth/register (admin, uso interno) — crea un User "pelado"
export interface RegisterRequest {
  username: string;
  password: string;
  type: UserType;
}

// POST /auth/register (público) — registro de cliente: crea User (login) + Owner (ficha).
// Campos en snake_case porque el backend usa Jackson SNAKE_CASE.
import type { DocumentType } from "@/types/owner";

export interface ClientRegisterRequest {
  username: string;
  password: string;
  document_type: DocumentType;
  dni: string;
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
  address: string;
}
