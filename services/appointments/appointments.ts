import { http } from "@/lib/axios";
import type { Appointment, AppointmentRequest } from "@/types/appointment";

// CRUD de citas contra el backend: /appointment
const BASE = "/v1/citas";

export const getAppointments = async () => {
  const { data } = await http.get<Appointment[]>(BASE);
  return data;
};

export const getAppointmentById = async (id: number) => {
  const { data } = await http.get<Appointment>(`${BASE}/${id}`);
  return data;
};

export const createAppointment = async (payload: AppointmentRequest) => {
  const { data } = await http.post<Appointment>(BASE, payload);
  return data;
};

export const updateAppointment = async (id: number, payload: AppointmentRequest) => {
  const { data } = await http.put<Appointment>(`${BASE}/${id}`, payload);
  return data;
};

export const deleteAppointment = async (id: number): Promise<void> => {
  await http.delete(`${BASE}/${id}`);
};
