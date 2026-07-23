import { http } from "@/lib/axios";
import type { Service, ServiceRequest } from "@/types/service";

// CRUD de servicios contra el backend: /services
const BASE = "/v1/servicios";

export const getServices = async () => {
  const { data } = await http.get<Service[]>(BASE);
  return data;
};

export const getServiceById = async (id: number) => {
  const { data } = await http.get<Service>(`${BASE}/${id}`);
  return data;
};

export const createService = async (payload: ServiceRequest) => {
  const { data } = await http.post<Service>(BASE, payload);
  return data;
};

export const updateService = async (id: number, payload: ServiceRequest) => {
  const { data } = await http.put<Service>(`${BASE}/${id}`, payload);
  return data;
};

export const deleteService = async (id: number): Promise<void> => {
  await http.delete(`${BASE}/${id}`);
};

export const activateService = async (id: number): Promise<void> => {
  await http.patch(`${BASE}/${id}/activar`);
};

export const deactivateService = async (id: number): Promise<void> => {
  await http.patch(`${BASE}/${id}/desactivar`);
};
