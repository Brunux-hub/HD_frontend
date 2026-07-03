import type { User } from "@/types/user";

// ReceptionistResponse del backend: { id_receptionist, user, names, last_names, email, phone_number }
export interface Receptionist {
  id_receptionist: number;
  user: User;
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
}

// ReceptionistRequest del backend: { id_user, names, last_names, email, phone_number }
export interface ReceptionistRequest {
  id_user: number;
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
}
