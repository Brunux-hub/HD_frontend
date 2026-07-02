import type { UserType } from "@/types/enums";

export interface ReceptionistUser {
  idUser: number;
  username: string;
  type: UserType;
}

export interface ReceptionistItem {
  idReceptionist: number;
  user: ReceptionistUser;
  names: string;
  lastNames: string;
  email: string;
  phoneNumber: string;
}

export type ReceptionistResponse = ReceptionistItem[];

export interface CreateReceptionistRequest {
  idUser: number;
  names: string;
  lastNames: string;
  email: string;
  phoneNumber: string;
}

export type UpdateReceptionistRequest = CreateReceptionistRequest;
