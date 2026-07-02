import { http } from "@/lib/axios";

import type {
  CreateServiceRequest,
  ServiceItem,
  ServiceResponse,
  UpdateServiceRequest,
} from "@/types/servicio";

export async function httpGetServicesAPI(): Promise<ServiceResponse> {
  const response = await http.get<ServiceResponse>("/services");
  return response.data;
}

export async function httpGetServiceByIdAPI(id: number): Promise<ServiceItem> {
  const response = await http.get<ServiceItem>(`/services/${id}`);
  return response.data;
}

export async function httpPostServiceAPI(
  payload: CreateServiceRequest,
): Promise<ServiceItem> {
  const response = await http.post<ServiceItem>("/services", payload);
  return response.data;
}

export async function httpPutServiceAPI(
  id: number,
  payload: UpdateServiceRequest,
): Promise<ServiceItem> {
  const response = await http.put<ServiceItem>(`/services/${id}`, payload);
  return response.data;
}

export async function httpDeleteServiceAPI(id: number): Promise<void> {
  await http.delete(`/services/${id}`);
}
