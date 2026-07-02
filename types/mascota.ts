import type { PetGender } from "@/types/enums";
import type { Owner } from "@/types/owner";

export interface PetItem {
  idPet: number;
  owner: Owner;
  name: string;
  species: string;
  race: string;
  birthdate: string;
  petGender: PetGender;
  weight: string;
}

export type PetResponse = PetItem[];

export interface CreatePetRequest {
  idOwner: number;
  name: string;
  species: string;
  race: string;
  birthdate: string;
  sex: PetGender;
  weight: string;
}

export type UpdatePetRequest = CreatePetRequest;
