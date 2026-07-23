import { http } from "@/lib/axios";
import type { Tratamiento, TratamientoRequest } from "@/types/tratamiento";

export const createTratamiento = async (payload: TratamientoRequest): Promise<Tratamiento> => {
  const { data } = await http.post<Tratamiento>("/v1/tratamientos", payload);
  return data;
};