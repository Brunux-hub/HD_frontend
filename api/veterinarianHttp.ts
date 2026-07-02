import { http } from "@/lib/axios";

import type {
  CreateVeterinarianRequest,
  UpdateVeterinarianRequest,
  VeterinarianItem,
  VeterinarianResponse,
} from "@/types/veterinario";

const BASE = "/veterinarian";

function serializeVeterinarianRequest(
  payload: CreateVeterinarianRequest | UpdateVeterinarianRequest,
) {
  return {
    idUser: payload.idUser,
    id_user: payload.idUser,
    userId: payload.idUser,
    userResponse: {
      idUser: payload.idUser,
    },
    names: payload.names,
    lastNames: payload.lastNames,
    last_names: payload.lastNames,
    numberLicense: payload.numberLicense,
    number_license: payload.numberLicense,
    specialty: payload.specialty,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    phone_number: payload.phoneNumber,
  };
}

export async function httpGetVeterinariansAPI(): Promise<VeterinarianResponse> {
  const response = await http.get<VeterinarianResponse>(BASE);
  return response.data;
}

export async function httpGetVeterinarianByIdAPI(
  id: number,
): Promise<VeterinarianItem> {
  const response = await http.get<VeterinarianItem>(`${BASE}/${id}`);
  return response.data;
}

export async function httpPostVeterinarianAPI(
  payload: CreateVeterinarianRequest,
): Promise<VeterinarianItem> {
  const response = await http.post<VeterinarianItem>(
    BASE,
    serializeVeterinarianRequest(payload),
  );
  return response.data;
}

export async function httpPutVeterinarianAPI(
  id: number,
  payload: UpdateVeterinarianRequest,
): Promise<VeterinarianItem> {
  const response = await http.put<VeterinarianItem>(
    `${BASE}/${id}`,
    serializeVeterinarianRequest(payload),
  );
  return response.data;
}

export async function httpDeleteVeterinarianAPI(id: number): Promise<void> {
  await http.delete(`${BASE}/${id}`);
}
