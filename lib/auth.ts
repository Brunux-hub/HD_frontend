/**
 * Helpers de autenticación (lado cliente).
 * El token JWT se guarda en una cookie para que:
 *  - el middleware (server) pueda proteger las rutas del dashboard, y
 *  - el cliente HTTP (lib/api.ts) lo lea y lo mande en cada request.
 */
import type { UserType } from "@/types/enums";

export const TOKEN_COOKIE = "hd_vet_token";

/** Guarda el token en una cookie de sesión (se borra al cerrar el navegador). */
export function setToken(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; SameSite=Lax`;
}

/** Lee el token desde la cookie. */
export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${TOKEN_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

/** Elimina el token (logout). */
export function clearToken() {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

// --- Rol (cliente vs staff) para enrutar y proteger áreas desde el middleware ---
export const ROLE_COOKIE = "hd_vet_role";
export type Role =
  | "admin"
  | "veterinarian"
  | "receptionist"
  | "client"
  | "worker";

export function setRole(role: Role) {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; SameSite=Lax`;
}

/** Lee el rol desde la cookie (lado cliente). */
export function getRole(): Role | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${ROLE_COOKIE}=`));
  return match ? (decodeURIComponent(match.split("=")[1]) as Role) : null;
}

export function clearRole() {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export type JwtPayload = {
  sub?: string; // username
  role?: string;
  type?: UserType;
  exp?: number;
};

/** Decodifica el payload del JWT (sin verificar la firma) para mostrar datos en UI. */
export function decodeToken(token: string | null = getToken()): JwtPayload | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}
