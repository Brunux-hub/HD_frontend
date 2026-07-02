import { http } from "@/lib/axios";

import type {
  CreatePetRequest,
  PetItem,
  PetResponse,
  UpdatePetRequest,
} from "@/types/mascota";

const BASE = "/pet";

function serializePetRequest(payload: CreatePetRequest | UpdatePetRequest) {
  return {
    idOwner: payload.idOwner,
    ownerId: payload.idOwner,
    name: payload.name,
    species: payload.species,
    race: payload.race,
    birthdate: payload.birthdate,
    sex: payload.sex,
    weight: payload.weight,
  };
}

export async function httpGetPetsAPI(): Promise<PetResponse> {
  const response = await http.get<PetResponse>(BASE);
  return response.data;
}

export async function httpGetPetByIdAPI(id: number): Promise<PetItem> {
  const response = await http.get<PetItem>(`${BASE}/${id}`);
  return response.data;
}

export async function httpPostPetAPI(payload: CreatePetRequest): Promise<PetItem> {
  const response = await http.post<PetItem>(BASE, serializePetRequest(payload));
  return response.data;
}

export async function httpPutPetAPI(
  id: number,
  payload: UpdatePetRequest,
): Promise<PetItem> {
  const response = await http.put<PetItem>(`${BASE}/${id}`, serializePetRequest(payload));
  return response.data;
}

export async function httpDeletePetAPI(id: number): Promise<void> {
  await http.delete(`${BASE}/${id}`);
}
