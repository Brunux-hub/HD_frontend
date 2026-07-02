import {
  httpCreateMedicalHistoryAPI,
  httpGetMedicalHistoryByPetAPI,
} from "@/api/medicalHistoryHttp";
import type {
  CreateMedicalHistoryRequest,
  MedicalHistoryItem,
  MedicalHistoryResponse,
} from "@/types/medicalHistory";

function normalizeAppointment(appointment: Record<string, unknown>): MedicalHistoryItem["appointment"] {
  const vet = (appointment.veterinarian ?? appointment.vet ?? {}) as Record<string, unknown>;
  const vetName = [
    vet.names ?? vet.name ?? "",
    vet.last_names ?? vet.lastNames ?? "",
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    idAppointment: (appointment.idAppointment ?? appointment.id_appointment ?? 0) as number,
    date: (appointment.date ?? "") as string,
    veterinarianName: vetName || ((appointment.veterinarianName ?? "") as string),
  };
}

function normalizeServices(services: Record<string, unknown>): MedicalHistoryItem["services"] {
  return {
    idService: (services.idService ?? services.id_service ?? 0) as number,
    name: (services.name ?? "") as string,
  };
}

function normalizeItem(item: Record<string, unknown>): MedicalHistoryItem {
  return {
    idMedicalHistory: (item.idMedicalHistory ?? item.id_medical_history ?? 0) as number,
    appointment: normalizeAppointment((item.appointment ?? {}) as Record<string, unknown>),
    services: normalizeServices((item.services ?? {}) as Record<string, unknown>),
    description: (item.description ?? "") as string,
    date: (item.date ?? "") as string,
  };
}

export async function findMedicalHistoryByPet(idPet: number): Promise<MedicalHistoryResponse> {
  const data = await httpGetMedicalHistoryByPetAPI(idPet);
  return (data ?? []).map((item) => normalizeItem(item as unknown as Record<string, unknown>));
}

export async function createMedicalHistory(
  payload: CreateMedicalHistoryRequest,
): Promise<MedicalHistoryItem> {
  const data = await httpCreateMedicalHistoryAPI(payload);
  return normalizeItem(data as unknown as Record<string, unknown>);
}
