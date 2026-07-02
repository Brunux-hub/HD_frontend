import { http } from "@/lib/axios";

import type {
  CreateReceptionistRequest,
  ReceptionistItem,
  ReceptionistResponse,
  UpdateReceptionistRequest,
} from "@/types/recepcionista";

const BASE = "/receptionist";

function serializeReceptionistRequest(
  payload: CreateReceptionistRequest | UpdateReceptionistRequest,
) {
  return {
    idUser: payload.idUser,
    id_user: payload.idUser,
    userId: payload.idUser,
    user: {
      idUser: payload.idUser,
    },
    names: payload.names,
    lastNames: payload.lastNames,
    last_names: payload.lastNames,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    phone_number: payload.phoneNumber,
  };
}

export async function httpGetReceptionistsAPI(): Promise<ReceptionistResponse> {
  const response = await http.get<ReceptionistResponse>(BASE);
  return response.data;
}

export async function httpGetReceptionistByIdAPI(
  id: number,
): Promise<ReceptionistItem> {
  const response = await http.get<ReceptionistItem>(`${BASE}/${id}`);
  return response.data;
}

export async function httpPostReceptionistAPI(
  payload: CreateReceptionistRequest,
): Promise<ReceptionistItem> {
  const response = await http.post<ReceptionistItem>(
    BASE,
    serializeReceptionistRequest(payload),
  );
  return response.data;
}

export async function httpPutReceptionistAPI(
  id: number,
  payload: UpdateReceptionistRequest,
): Promise<ReceptionistItem> {
  const response = await http.put<ReceptionistItem>(
    `${BASE}/${id}`,
    serializeReceptionistRequest(payload),
  );
  return response.data;
}

export async function httpDeleteReceptionistAPI(id: number): Promise<void> {
  await http.delete(`${BASE}/${id}`);
}
