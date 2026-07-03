import type { AppointmentStatus } from "@/types/enums";
import type { Pet } from "@/types/pet";
import type { Veterinarian } from "@/types/veterinarian";
import type { Receptionist } from "@/types/receptionist";

// AppointmentResponse del backend: incluye las entidades completas (receptionist, pet, veterinarian).
export interface Appointment {
  id_appointment: number;
  receptionist: Receptionist;
  pet: Pet;
  veterinarian: Veterinarian;
  date: string; // LocalDateTime ISO ("yyyy-MM-ddTHH:mm...")
  time_minutes: number;
  reason: string;
  notes: string;
  status: AppointmentStatus;
}

// AppointmentRequest del backend: referencia a las entidades por id.
export interface AppointmentRequest {
  id_pet: number;
  id_veterinarian: number;
  date: string; // "yyyy-MM-ddTHH:mm"
  reason: string;
  notes: string;
}
