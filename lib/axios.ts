/**
 * Cliente HTTP basado en Axios para hablar con el backend Spring (api_healthy_pet).
 *
 * Hace lo mismo que lib/api.ts (fetch) pero con Axios, usando interceptores:
 *  - Request:  inyecta el token JWT (Authorization: Bearer ...) en cada llamada.
 *  - Response: normaliza los errores a ApiError y, ante un 401, limpia la
 *              sesión y redirige a /login.
 *
 * Las llamadas van a /api/* (mismo origen); Next las reenvía al backend vía el
 * rewrite de next.config.ts, así que en desarrollo no hay problemas de CORS.
 */
import axios, { AxiosError } from "axios";

import { clearToken, getToken } from "@/lib/auth";

/** Error normalizado de la API (status + mensaje). */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const http = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// --- Request: adjunta el JWT si existe, EXCEPTO en los endpoints públicos de auth ---
// (login/register no deben llevar un token viejo: si es de un usuario borrado,
//  el backend responde 401 y rompe el login/registro de forma intermitente).
http.interceptors.request.use((config) => {
  const url = config.url ?? "";
  const isPublicAuth =
    url.startsWith("/auth/login") || url.startsWith("/auth/register");

  if (!isPublicAuth) {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response: 401 -> logout+redirect; el resto -> ApiError con mensaje útil ---
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const status = error.response?.status ?? 0;

    if (status === 401) {
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      // En las páginas de auth (login/register) dejamos que el componente muestre
      // el error; no redirigimos para no "tragarnos" el mensaje.
      const onAuthPage = path.startsWith("/login") || path.startsWith("/register");

      if (!onAuthPage) {
        clearToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(new ApiError(401, "Sesión expirada. Inicia sesión de nuevo."));
      }

      return Promise.reject(new ApiError(401, "No autorizado."));
    }

    const data = error.response?.data;
    const message =
      data?.message ?? data?.error ?? error.message ?? `Error ${status || ""}`.trim();

    return Promise.reject(new ApiError(status, message));
  },
);
