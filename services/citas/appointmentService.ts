import {
  httpDeleteAppointmentAPI,
  httpGetAppointmentByIdAPI,
  httpGetAppointmentsAPI,
  httpPostAppointmentAPI,
  httpPutAppointmentAPI,
} from "@/api/appointmentHttp";
import type {
  AppointmentItem,
  AppointmentResponse,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from "@/types/cita";

export async function findAllAppointments(): Promise<AppointmentResponse> {
  const response = await httpGetAppointmentsAPI();
  return response ?? [];
}

export async function findAppointmentById(id: number): Promise<AppointmentItem> {
  const response = await httpGetAppointmentByIdAPI(id);
  return response;
}

export async function createAppointment(
  payload: CreateAppointmentRequest,
): Promise<AppointmentItem> {
  const response = await httpPostAppointmentAPI(payload);
  return response;
}

export async function updateAppointment(
  id: number,
  payload: UpdateAppointmentRequest,
): Promise<AppointmentItem> {
  const response = await httpPutAppointmentAPI(id, payload);
  return response;
}

export async function deleteAppointment(id: number): Promise<void> {
  await httpDeleteAppointmentAPI(id);
}
