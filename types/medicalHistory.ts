import type { Appointment } from "@/types/appointment";
import type { Service } from "@/types/service";

export interface MedicalHistory {
  id_medical_history: number;
  appointment: Appointment;
  services: Service;
  weight: string;
  diagnosis: string;
  treatment: string;
}

export interface MedicalHistoryRequest {
  id_appointment: number;
  id_service: number;
  weight: string;
  diagnosis: string;
  treatment: string;
}
