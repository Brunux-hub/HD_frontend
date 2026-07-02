import {
  httpDeleteVeterinarianAPI,
  httpGetVeterinarianByIdAPI,
  httpGetVeterinariansAPI,
  httpPostVeterinarianAPI,
  httpPutVeterinarianAPI,
} from "@/api/veterinarianHttp";
import type {
  CreateVeterinarianRequest,
  UpdateVeterinarianRequest,
  VeterinarianItem,
  VeterinarianResponse,
} from "@/types/veterinario";

export async function findAllVeterinarians(): Promise<VeterinarianResponse> {
  const response = await httpGetVeterinariansAPI();
  return response ?? [];
}

export async function findVeterinarianById(id: number): Promise<VeterinarianItem> {
  const response = await httpGetVeterinarianByIdAPI(id);
  return response;
}

export async function createVeterinarian(
  payload: CreateVeterinarianRequest,
): Promise<VeterinarianItem> {
  const response = await httpPostVeterinarianAPI(payload);
  return response;
}

export async function updateVeterinarian(
  id: number,
  payload: UpdateVeterinarianRequest,
): Promise<VeterinarianItem> {
  const response = await httpPutVeterinarianAPI(id, payload);
  return response;
}

export async function deleteVeterinarian(id: number): Promise<void> {
  await httpDeleteVeterinarianAPI(id);
}
