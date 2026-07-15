import { http } from "@/lib/axios";
import type { Receta, RecetaRequest } from "@/types/receta";
import type { ItemReceta } from "@/types/itemReceta";

export const createReceta = async (payload: RecetaRequest): Promise<Receta> => {
  const { data } = await http.post<Receta>("/v1/recetas", payload);
  return data;
};

export const getItemsByReceta = async (idReceta: number): Promise<ItemReceta[]> => {
  const { data } = await http.get<ItemReceta[]>(`/v1/recetas/${idReceta}/items`);
  return data;
};