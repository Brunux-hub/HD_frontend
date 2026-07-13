import { http } from "@/lib/axios";
import type { Owner, OwnerRequest } from "@/types/owner";

// CRUD de clientes (Owner) contra el backend: /owner  (usando Axios)
const BASE = "/v1/clientes";

export const getOwners = async () => {
  const { data } = await http.get<Owner[]>(BASE);
  return data;
};

export const getOwnerById = async (id: number) => {
  const { data } = await http.get<Owner>(`${BASE}/${id}`);
  return data;
};

export const createOwner = async (payload: OwnerRequest) => {
  const { data } = await http.post<Owner>(BASE, payload);
  return data;
};

export const updateOwner = async (id: number, payload: OwnerRequest) => {
  const { data } = await http.put<Owner>(`${BASE}/${id}`, payload);
  return data;
};

export const deleteOwner = async (id: number): Promise<void> => {
  await http.delete(`${BASE}/${id}`);
};

// GET /owner/me -> Owner del usuario logueado, o null si no es cliente (204 = staff).
export const getMyOwner = async (): Promise<Owner | null> => {
  const { data } = await http.get<Owner>(`${BASE}/me`);
  return data || null;
};

// GET /owner/dni/{dni} -> Owner con ese DNI, o null si no existe (204).
export const getOwnerByDni = async (dni: string): Promise<Owner | null> => {
  const { data } = await http.get<Owner>(`${BASE}/dni/${encodeURIComponent(dni)}`);
  return data || null;
};
