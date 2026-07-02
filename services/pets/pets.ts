import { http } from "@/lib/axios";
import type { Pet, PetRequest } from "@/types/pet";

// CRUD de mascotas (Pet) contra el backend: /pet
const BASE = "/pet";

export const getPets = async () => {
  const { data } = await http.get<Pet[]>(BASE);
  return data;
};

export const getPetById = async (id: number) => {
  const { data } = await http.get<Pet>(`${BASE}/${id}`);
  return data;
};

// Mascotas de un dueño: el backend no filtra por owner, así que traemos todas
// y filtramos por el owner embebido en la respuesta.
export const getPetsByOwner = async (idOwner: number) => {
  const pets = await getPets();
  return pets.filter((p) => p.owner?.id_owner === idOwner);
};

export const createPet = async (payload: PetRequest) => {
  const { data } = await http.post<Pet>(BASE, payload);
  return data;
};

export const updatePet = async (id: number, payload: PetRequest) => {
  const { data } = await http.put<Pet>(`${BASE}/${id}`, payload);
  return data;
};

export const deletePet = async (id: number): Promise<void> => {
  await http.delete(`${BASE}/${id}`);
};
