import { http } from "@/lib/axios";

import type {
  AppointmentItem,
  AppointmentResponse,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from "@/types/cita";

const BASE = "/appointment";

function serializeAppointmentRequest(
  payload: CreateAppointmentRequest | UpdateAppointmentRequest,
) {
  return {
    idReceptionist: payload.idReceptionist,
    id_receptionist: payload.idReceptionist,
    receptionistId: payload.idReceptionist,
    idPet: payload.idPet,
    id_pet: payload.idPet,
    petId: payload.idPet,
    idVeterinarian: payload.idVeterinarian,
    id_veterinarian: payload.idVeterinarian,
    veterinarianId: payload.idVeterinarian,
    date: payload.date,
    timeMinutes: payload.timeMinutes,
    time_minutes: payload.timeMinutes,
    reason: payload.reason,
    notes: payload.notes,
    status: payload.status,
  };
}

export async function httpGetAppointmentsAPI(): Promise<AppointmentResponse> {
  const response = await http.get<AppointmentResponse>(BASE);
  return response.data;
}

export async function httpGetAppointmentByIdAPI(
  id: number,
): Promise<AppointmentItem> {
  const response = await http.get<AppointmentItem>(`${BASE}/${id}`);
  return response.data;
}

export async function httpPostAppointmentAPI(
  payload: CreateAppointmentRequest,
): Promise<AppointmentItem> {
  const response = await http.post<AppointmentItem>(
    BASE,
    serializeAppointmentRequest(payload),
  );
  return response.data;
}

export async function httpPutAppointmentAPI(
  id: number,
  payload: UpdateAppointmentRequest,
): Promise<AppointmentItem> {
  const response = await http.put<AppointmentItem>(
    `${BASE}/${id}`,
    serializeAppointmentRequest(payload),
  );
  return response.data;
}

export async function httpDeleteAppointmentAPI(id: number): Promise<void> {
  await http.delete(`${BASE}/${id}`);
}
