import { http } from "@/lib/axios";
import { setToken, clearToken, clearRole, clearUserData } from "@/lib/auth";
import type {
  AuthResponse,
  ClientRegisterRequest,
  LoginRequest,
  MeResponse,
} from "@/types/auth";
import type { ClienteResponse } from "@/types/cliente";

/** POST /v1/auth/login -> guarda el token JWT en cookie y lo devuelve. */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/v1/auth/login", credentials);
  setToken(data.token);
  return data;
}

/** GET /v1/auth/me -> rol del usuario autenticado. */
export async function getMe(): Promise<MeResponse> {
  const { data } = await http.get<MeResponse>("/v1/auth/me");
  return data;
}

/** POST /auth/register (público) -> registra un cliente. */
export async function register(payload: ClientRegisterRequest): Promise<ClienteResponse> {
  const { data } = await http.post<ClienteResponse>("/auth/register", payload);
  return data;
}

/** Logout: elimina el token, el rol y los datos del usuario. */
export function logout() {
  clearToken();
  clearRole();
  clearUserData();
}
