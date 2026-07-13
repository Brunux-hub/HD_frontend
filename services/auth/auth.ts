import { http } from "@/lib/axios";
import { setToken, clearToken, clearRole, clearUserData } from "@/lib/auth";
import type {
  AuthResponse,
  ClientRegisterRequest,
  LoginRequest,
} from "@/types/auth";
import type { Owner } from "@/types/owner";

/** POST /v1/auth/login -> guarda el token JWT en cookie y lo devuelve. */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/v1/auth/login", credentials);
  setToken(data.token);
  return data;
}

/** POST /auth/register (público) -> registra un cliente: crea User + Owner. */
export async function register(payload: ClientRegisterRequest): Promise<Owner> {
  const { data } = await http.post<Owner>("/auth/register", payload);
  return data;
}

/** Logout: elimina el token, el rol y los datos del usuario. */
export function logout() {
  clearToken();
  clearRole();
  clearUserData();
}
