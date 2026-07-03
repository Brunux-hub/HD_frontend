import { http } from "@/lib/axios";
import type { Vaccination, VaccinationRequest } from "@/types/vaccination";

// CRUD de vacunaciones contra el backend: /vaccination
const BASE = "/vaccination";

export const getVaccinations = async () => {
  const { data } = await http.get<Vaccination[]>(BASE);
  return data;
};

export const getVaccinationById = async (id: number) => {
  const { data } = await http.get<Vaccination>(`${BASE}/${id}`);
  return data;
};

export const createVaccination = async (payload: VaccinationRequest) => {
  const { data } = await http.post<Vaccination>(BASE, payload);
  return data;
};

export const updateVaccination = async (id: number, payload: VaccinationRequest) => {
  const { data } = await http.put<Vaccination>(`${BASE}/${id}`, payload);
  return data;
};

export const deleteVaccination = async (id: number): Promise<void> => {
  await http.delete(`${BASE}/${id}`);
};
