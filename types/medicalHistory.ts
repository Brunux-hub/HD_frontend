import type { Appointment } from "@/types/appointment";
import type { Service } from "@/types/service";

// MedicalHistoryResponse del backend: incluye las entidades completas (appointment, services).
// Nota: el campo de respuesta es `services` aunque es un único Service.
export interface MedicalHistory {
  id_medical_history: number;
  appointment: Appointment;
  services: Service;
  description: string;
  date: string; // LocalDateTime ISO ("yyyy-MM-ddTHH:mm...")
}

// MedicalHistoryRequest del backend: referencia a las entidades por id.
export interface MedicalHistoryRequest {
  id_appointment: number;
  id_service: number;
  description: string;
  date: string; // "yyyy-MM-ddTHH:mm"
}
