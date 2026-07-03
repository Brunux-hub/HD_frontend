import { http } from "@/lib/axios";
import type { Vaccine, VaccineRequest } from "@/types/vaccine";

// CRUD de vacunas contra el backend: /vaccine
const BASE = "/vaccine";

export const getVaccines = async () => {
  const { data } = await http.get<Vaccine[]>(BASE);
  return data;
};

export const getVaccineById = async (id: number) => {
  const { data } = await http.get<Vaccine>(`${BASE}/${id}`);
  return data;
};

export const createVaccine = async (payload: VaccineRequest) => {
  const { data } = await http.post<Vaccine>(BASE, payload);
  return data;
};

export const updateVaccine = async (id: number, payload: VaccineRequest) => {
  const { data } = await http.put<Vaccine>(`${BASE}/${id}`, payload);
  return data;
};

export const deleteVaccine = async (id: number): Promise<void> => {
  await http.delete(`${BASE}/${id}`);
};
