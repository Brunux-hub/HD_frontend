import { http } from "@/lib/axios";

import type {
  CreateMedicalHistoryRequest,
  MedicalHistoryItem,
} from "@/types/medicalHistory";

const BASE = "/medical_history";

export async function httpGetMedicalHistoryByPetAPI(idPet: number): Promise<MedicalHistoryItem[]> {
  const response = await http.get<MedicalHistoryItem[]>(`${BASE}/pet/${idPet}`);
  return response.data;
}

export async function httpCreateMedicalHistoryAPI(data: CreateMedicalHistoryRequest): Promise<MedicalHistoryItem> {
  const response = await http.post<MedicalHistoryItem>(BASE, {
    id_appointment: data.idAppointment,
    id_service: data.idService,
    description: data.description,
    date: data.date,
  });
  return response.data;
}
