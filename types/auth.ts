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
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
  address: string;
}
