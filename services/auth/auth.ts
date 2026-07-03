import { http } from "@/lib/axios";
import { setToken, clearToken, clearRole } from "@/lib/auth";
import type {
  AuthResponse,
  ClientRegisterRequest,
  LoginRequest,
  MeResponse,
} from "@/types/auth";
import type { Owner } from "@/types/owner";

/** POST /auth/login -> guarda el token JWT en cookie y lo devuelve. */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/login", credentials);
  setToken(data.token);
  return data;
}

/** GET /auth/me -> rol fino del usuario autenticado. */
export async function getMe(): Promise<MeResponse> {
  const { data } = await http.get<MeResponse>("/auth/me");
  return data;
}

/** POST /auth/register (público) -> registra un cliente: crea User + Owner. */
export async function register(payload: ClientRegisterRequest): Promise<Owner> {
  const { data } = await http.post<Owner>("/auth/register", payload);
  return data;
}

/** Logout: elimina el token y el rol. */
export function logout() {
  clearToken();
  clearRole();
}
