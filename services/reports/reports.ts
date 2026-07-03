import { http } from "@/lib/axios";
import type { MedicalHistory } from "@/types/medicalHistory";
import type { Appointment } from "@/types/appointment";
import type { AppointmentStatus } from "@/types/enums";

// Reportes (solo lectura) contra el backend: /reports
const BASE = "/reports";

// Servicios realizados: historiales médicos de citas completadas.
export const getCompletedServices = async (): Promise<MedicalHistory[]> => {
  const { data } = await http.get<MedicalHistory[]>(`${BASE}/completed-services`);
  return data;
};

// Citas filtradas por estado (OPENED|CLOSED|CANCELED|RESCHEDULED).
export const getAppointmentsByStatus = async (
  status: AppointmentStatus,
): Promise<Appointment[]> => {
  const { data } = await http.get<Appointment[]>(`${BASE}/appointments`, {
    params: { status },
  });
  return data;
};
