import {
  httpDeleteServiceAPI,
  httpGetServiceByIdAPI,
  httpGetServicesAPI,
  httpPostServiceAPI,
  httpPutServiceAPI,
} from "@/api/serviceHttp";
import type {
  CreateServiceRequest,
  ServiceItem,
  ServiceResponse,
  UpdateServiceRequest,
} from "@/types/servicio";

export async function findAllServices(): Promise<ServiceResponse> {
  const response = await httpGetServicesAPI();
  return response ?? [];
}

export async function findServiceById(id: number): Promise<ServiceItem> {
  const response = await httpGetServiceByIdAPI(id);
  return response;
}

export async function createService(
  payload: CreateServiceRequest,
): Promise<ServiceItem> {
  const response = await httpPostServiceAPI(payload);
  return response;
}

export async function updateService(
  id: number,
  payload: UpdateServiceRequest,
): Promise<ServiceItem> {
  const response = await httpPutServiceAPI(id, payload);
  return response;
}

export async function deleteService(id: number): Promise<void> {
  await httpDeleteServiceAPI(id);
}
