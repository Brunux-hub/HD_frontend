import { http } from "@/lib/axios";
import type { Veterinarian, VeterinarianRequest } from "@/types/veterinarian";

// CRUD de veterinarios contra el backend: /veterinarian
const BASE = "/veterinarian";

export const getVeterinarians = async () => {
  const { data } = await http.get<Veterinarian[]>(BASE);
  return data;
};

export const getVeterinarianById = async (id: number) => {
  const { data } = await http.get<Veterinarian>(`${BASE}/${id}`);
  return data;
};

export const createVeterinarian = async (payload: VeterinarianRequest) => {
  const { data } = await http.post<Veterinarian>(BASE, payload);
  return data;
};

export const updateVeterinarian = async (id: number, payload: VeterinarianRequest) => {
  const { data } = await http.put<Veterinarian>(`${BASE}/${id}`, payload);
  return data;
};

export const deleteVeterinarian = async (id: number): Promise<void> => {
  await http.delete(`${BASE}/${id}`);
};
