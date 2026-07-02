import {
  httpDeletePetAPI,
  httpGetPetByIdAPI,
  httpGetPetsAPI,
  httpPostPetAPI,
  httpPutPetAPI,
} from "@/api/petHttp";
import type {
  CreatePetRequest,
  PetItem,
  PetResponse,
  UpdatePetRequest,
} from "@/types/mascota";

export async function findAllPets(): Promise<PetResponse> {
  const response = await httpGetPetsAPI();
  return response ?? [];
}

export async function findPetById(id: number): Promise<PetItem> {
  const response = await httpGetPetByIdAPI(id);
  return response;
}

export async function createPet(payload: CreatePetRequest): Promise<PetItem> {
  const response = await httpPostPetAPI(payload);
  return response;
}

export async function updatePet(
  id: number,
  payload: UpdatePetRequest,
): Promise<PetItem> {
  const response = await httpPutPetAPI(id, payload);
  return response;
}

export async function deletePet(id: number): Promise<void> {
  await httpDeletePetAPI(id);
}
