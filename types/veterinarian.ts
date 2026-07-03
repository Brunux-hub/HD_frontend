import type { User } from "@/types/user";

// VeterinarianResponse del backend: incluye la cuenta de usuario asociada (user_response).
export interface Veterinarian {
  id_veterinarian: number;
  user_response: User;
  names: string;
  last_names: string;
  number_license: string;
  specialty: string;
  email: string;
  phone_number: string;
}

// VeterinarianRequest del backend: referencia al usuario por id_user.
export interface VeterinarianRequest {
  id_user: number;
  names: string;
  last_names: string;
  number_license: string;
  specialty: string;
  email: string;
  phone_number: string;
}
