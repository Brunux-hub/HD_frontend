import {
  httpDeleteReceptionistAPI,
  httpGetReceptionistByIdAPI,
  httpGetReceptionistsAPI,
  httpPostReceptionistAPI,
  httpPutReceptionistAPI,
} from "@/api/receptionistHttp";
import type {
  CreateReceptionistRequest,
  ReceptionistItem,
  ReceptionistResponse,
  UpdateReceptionistRequest,
} from "@/types/recepcionista";

export async function findAllReceptionists(): Promise<ReceptionistResponse> {
  const response = await httpGetReceptionistsAPI();
  return response ?? [];
}

export async function findReceptionistById(id: number): Promise<ReceptionistItem> {
  const response = await httpGetReceptionistByIdAPI(id);
  return response;
}

export async function createReceptionist(
  payload: CreateReceptionistRequest,
): Promise<ReceptionistItem> {
  const response = await httpPostReceptionistAPI(payload);
  return response;
}

export async function updateReceptionist(
  id: number,
  payload: UpdateReceptionistRequest,
): Promise<ReceptionistItem> {
  const response = await httpPutReceptionistAPI(id, payload);
  return response;
}

export async function deleteReceptionist(id: number): Promise<void> {
  await httpDeleteReceptionistAPI(id);
}
