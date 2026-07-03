import { http } from "@/lib/axios";
import type { MedicalHistory, MedicalHistoryRequest } from "@/types/medicalHistory";

// CRUD de historiales médicos contra el backend: /medical_history
const BASE = "/medical_history";

export const getMedicalHistories = async () => {
  const { data } = await http.get<MedicalHistory[]>(BASE);
  return data;
};

export const getMedicalHistoryById = async (id: number) => {
  const { data } = await http.get<MedicalHistory>(`${BASE}/${id}`);
  return data;
};

export const createMedicalHistory = async (payload: MedicalHistoryRequest) => {
  const { data } = await http.post<MedicalHistory>(BASE, payload);
  return data;
};

export const updateMedicalHistory = async (id: number, payload: MedicalHistoryRequest) => {
  const { data } = await http.put<MedicalHistory>(`${BASE}/${id}`, payload);
  return data;
};

export const deleteMedicalHistory = async (id: number): Promise<void> => {
  await http.delete(`${BASE}/${id}`);
};
