import type { UserType } from "@/types/enums";

// POST /api/v1/auth/login
export interface LoginRequest {
  correo: string;
  contrasenia: string;
}

// Respuesta de /api/v1/auth/login
export interface AuthResponse {
  token: string;
  idUsuario: number;
  correo: string;
  rol: StaffRole;
  habilitado: boolean;
  nombres: string;
  apellidos: string;
}

// Roles del sistema
export type StaffRole =
  | "ADMIN"
  | "VETERINARIAN"
  | "RECEPTIONIST"
  | "CLIENT"
  | "WORKER";

// POST /auth/register (admin, uso interno) — crea un User "pelado"
export interface RegisterRequest {
  username: string;
  password: string;
  type: UserType;
}

// POST /auth/register (público) — registro de cliente: crea User (login) + Owner (ficha).
// Campos en snake_case porque el backend usa Jackson SNAKE_CASE.
export interface ClientRegisterRequest {
  username: string;
  password: string;
  dni: string;
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
  address: string;
}
