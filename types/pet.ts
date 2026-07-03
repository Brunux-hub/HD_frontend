import type { PetGender } from "@/types/enums";
import type { Owner } from "@/types/owner";

// PetResponse del backend: { id_pet, owner, name, species, race, birthdate, pet_gender, weight }
// OJO: en la respuesta el sexo viene como "pet_gender" (no "sex").
export interface Pet {
  id_pet: number;
  owner: Owner;
  name: string;
  species: string;
  race: string;
  birthdate: string; // ISO-8601 (Spring serializa Date como string)
  pet_gender: PetGender;
  weight: string;
}

// PetRequest del backend: { id_owner, name, species, race, birthdate, sex }
// OJO: en el request el sexo se manda como "sex".
export interface PetRequest {
  id_owner: number;
  name: string;
  species: string;
  race: string;
  birthdate: string; // "yyyy-MM-dd"
  sex: PetGender;
}
