import type { MedicalHistory } from "@/types/medicalHistory";
import type { Vaccine } from "@/types/vaccine";

export interface Vaccination {
  id_vaccination: number;
  medical_history: MedicalHistory;
  vaccine: Vaccine;
  application_date: string;
  next_application_date: string;
  observation: string;
}

export interface VaccinationRequest {
  id_medical_history: number;
  id_vaccine: number;
  application_date: string;
  next_application_date: string;
  observation: string;
}
