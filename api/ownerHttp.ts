import { http } from "@/lib/axios";

import type {
  OwnerApiCamel,
  OwnerApiSnake,
  OwnerRequest,
} from "@/types/owner";

const BASE = "/owner";

function serializeOwnerRequest(payload: OwnerRequest) {
  return {
    names: payload.names,
    email: payload.email,
    address: payload.address,
    lastNames: payload.lastNames,
    phoneNumber: payload.phoneNumber,
    last_names: payload.lastNames,
    phone_number: payload.phoneNumber,
  };
}

export async function httpGetOwnersAPI(): Promise<OwnerApiSnake[]> {
  const response = await http.get<OwnerApiSnake[]>(BASE);
  return response.data;
}

export async function httpGetOwnerByIdAPI(id: number): Promise<OwnerApiSnake> {
  const response = await http.get<OwnerApiSnake>(`${BASE}/${id}`);
  return response.data;
}

export async function httpGetMyOwnerAPI(): Promise<OwnerApiCamel> {
  const response = await http.get<OwnerApiCamel>(`${BASE}/me`);
  return response.data;
}

export async function httpPostOwnerAPI(
  payload: OwnerRequest,
): Promise<OwnerApiSnake | OwnerApiCamel> {
  const response = await http.post<OwnerApiSnake | OwnerApiCamel>(
    BASE,
    serializeOwnerRequest(payload),
  );
  return response.data;
}

export async function httpPutOwnerAPI(
  id: number,
  payload: OwnerRequest,
): Promise<OwnerApiSnake | OwnerApiCamel> {
  const response = await http.put<OwnerApiSnake | OwnerApiCamel>(
    `${BASE}/${id}`,
    serializeOwnerRequest(payload),
  );
  return response.data;
}

export async function httpDeleteOwnerAPI(id: number): Promise<void> {
  await http.delete(`${BASE}/${id}`);
}
