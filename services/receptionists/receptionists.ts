import { http } from "@/lib/axios";
import type { Receptionist, ReceptionistRequest } from "@/types/receptionist";

// CRUD de recepcionistas contra el backend: /receptionist
const BASE = "/receptionist";

export const getReceptionists = async () => {
  const { data } = await http.get<Receptionist[]>(BASE);
  return data;
};

export const getReceptionistById = async (id: number) => {
  const { data } = await http.get<Receptionist>(`${BASE}/${id}`);
  return data;
};

export const createReceptionist = async (payload: ReceptionistRequest) => {
  const { data } = await http.post<Receptionist>(BASE, payload);
  return data;
};

export const updateReceptionist = async (id: number, payload: ReceptionistRequest) => {
  const { data } = await http.put<Receptionist>(`${BASE}/${id}`, payload);
  return data;
};

export const deleteReceptionist = async (id: number): Promise<void> => {
  await http.delete(`${BASE}/${id}`);
};
