export interface MedicalHistory {
  id_medical_history: number;
  appointment: import("@/types/appointment").Appointment;
  services: import("@/types/service").Service;
  description: string;
  date: string;
}

export interface MedicalHistoryRequest {
  id_appointment: number;
  id_service: number;
  description: string;
  date: string;
}
