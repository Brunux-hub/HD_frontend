import { http, ApiError } from "@/lib/axios";
import type { ClienteResponse, ClienteRequest } from "@/types/cliente";

const BASE = "/v1/clientes";

export const getOwners = async () => {
  const { data } = await http.get<ClienteResponse[]>(BASE);
  return data;
};

export const getOwnerById = async (id: number) => {
  const { data } = await http.get<ClienteResponse>(`${BASE}/${id}`);
  return data;
};

export const createOwner = async (payload: ClienteRequest) => {
  const { data } = await http.post<ClienteResponse>(BASE, payload);
  return data;
};

export const updateOwner = async (id: number, payload: ClienteRequest) => {
  const { data } = await http.put<ClienteResponse>(`${BASE}/${id}`, payload);
  return data;
};

export const deleteOwner = async (id: number): Promise<void> => {
  await http.delete(`${BASE}/${id}`);
};

export const getMyOwner = async (): Promise<ClienteResponse | null> => {
  const { data } = await http.get<ClienteResponse>(`${BASE}/me`);
  return data || null;
};

export const getOwnerByDni = async (dni: string): Promise<ClienteResponse | null> => {
  try {
    const { data } = await http.get<ClienteResponse>(`${BASE}/dni/${encodeURIComponent(dni)}`);
    return data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
};
