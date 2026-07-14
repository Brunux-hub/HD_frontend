import type { PetGender } from "@/types/enums";
import type { ClienteResponse } from "@/types/cliente";

export interface Pet {
  id_pet: number;
  owner: ClienteResponse;
  name: string;
  species: string;
  race: string;
  birthdate: string;
  pet_gender: PetGender;
  weight: string;
}

// PetRequest del backend: { id_owner, name, species, race, birthdate, sex, weight }
// OJO: en el request el sexo se manda como "sex".
export interface PetRequest {
  id_owner: number;
  name: string;
  species: string;
  race: string;
  birthdate: string; // "yyyy-MM-dd"
  sex: PetGender;
  weight: string;
}
