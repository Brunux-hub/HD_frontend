import type { AppointmentStatus, UserType } from "@/types/enums";
import type { PetItem } from "@/types/mascota";
import type { VeterinarianItem } from "@/types/veterinario";

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

export interface AppointmentItem {
  idAppointment: number;
  receptionist: ReceptionistItem;
  pet: PetItem;
  veterinarian: VeterinarianItem;
  date: string;
  timeMinutes: number;
  reason: string;
  notes: string;
  status: AppointmentStatus;
}

export type AppointmentResponse = AppointmentItem[];

export interface CreateAppointmentRequest {
  idReceptionist: number;
  idPet: number;
  idVeterinarian: number;
  date: string;
  timeMinutes: number;
  reason: string;
  notes: string;
  status: AppointmentStatus;
}

export type UpdateAppointmentRequest = CreateAppointmentRequest;
