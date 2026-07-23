import { http } from "@/lib/axios";
import type { RegistroMedico, RegistroMedicoRequest } from "@/types/registroMedico";
import type { Tratamiento } from "@/types/tratamiento";
import type { Receta } from "@/types/receta";

const BASE = "/v1/registros-medicos";

export const createRegistroMedico = async (payload: RegistroMedicoRequest): Promise<RegistroMedico> => {
  const { data } = await http.post<RegistroMedico>(BASE, payload);
  return data;
};

export const updateRegistroMedico = async (
  id: number,
  payload: RegistroMedicoRequest,
): Promise<RegistroMedico> => {
  const { data } = await http.put<RegistroMedico>(`${BASE}/${id}`, payload);
  return data;
};

export const getRegistrosMedicos = async (): Promise<RegistroMedico[]> => {
  const { data } = await http.get<RegistroMedico[]>(BASE);
  return data;
};

export const getTratamientosByRegistro = async (idRegistro: number): Promise<Tratamiento[]> => {
  const { data } = await http.get<Tratamiento[]>(`${BASE}/${idRegistro}/tratamientos`);
  return data;
};

export const getRecetasByRegistro = async (idRegistro: number): Promise<Receta[]> => {
  const { data } = await http.get<Receta[]>(`${BASE}/${idRegistro}/recetas`);
  return data;
};
