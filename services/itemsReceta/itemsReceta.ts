import { http } from "@/lib/axios";
import type { ItemReceta, ItemRecetaRequest } from "@/types/itemReceta";

export const createItemReceta = async (payload: ItemRecetaRequest): Promise<ItemReceta> => {
  const { data } = await http.post<ItemReceta>("/v1/items-receta", payload);
  return data;
};