import type { UserType } from "@/types/enums";

export interface VeterinarianUser {
  idUser: number;
  username: string;
  type: UserType;
}

export interface VeterinarianItem {
  idVeterinarian: number;
  userResponse: VeterinarianUser;
  names: string;
  lastNames: string;
  numberLicense: string;
  specialty: string;
  email: string;
  phoneNumber: string;
}

export type VeterinarianResponse = VeterinarianItem[];

export interface CreateVeterinarianRequest {
  idUser: number;
  names: string;
  lastNames: string;
  numberLicense: string;
  specialty: string;
  email: string;
  phoneNumber: string;
}

export type UpdateVeterinarianRequest = CreateVeterinarianRequest;
