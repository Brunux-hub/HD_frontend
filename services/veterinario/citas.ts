import { http } from "@/lib/axios";
import type { Appointment } from "@/types/appointment";

export const getCitasByVeterinario = async (idVeterinario: number): Promise<Appointment[]> => {
  const { data } = await http.get<Appointment[]>(`/v1/veterinarios/${idVeterinario}/citas`);
  return data;
};