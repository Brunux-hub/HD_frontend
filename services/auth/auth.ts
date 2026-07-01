import { http } from "@/lib/axios";
import { setToken, clearToken } from "@/lib/auth";
import type { AuthResponse, ClientRegisterRequest, LoginRequest } from "@/types/auth";
import type { Owner } from "@/types/owner";

/** POST /auth/login -> guarda el token JWT en cookie y lo devuelve. */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/login", credentials);
  setToken(data.token);
  return data;
}

/** POST /auth/register (público) -> registra un cliente: crea User + Owner. */
export async function register(payload: ClientRegisterRequest): Promise<Owner> {
  const { data } = await http.post<Owner>("/auth/register", payload);
  return data;
}

/** Logout: elimina el token. */
export function logout() {
  clearToken();
}
