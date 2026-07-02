export interface MedicalHistoryItem {
  idMedicalHistory: number;
  appointment: {
    idAppointment: number;
    date: string;
    veterinarianName: string;
  };
  services: {
    idService: number;
    name: string;
  };
  description: string;
  date: string;
}

export type MedicalHistoryResponse = MedicalHistoryItem[];

export interface CreateMedicalHistoryRequest {
  idAppointment: number;
  idService: number;
  description: string;
  date: string;
}
