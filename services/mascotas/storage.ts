import { StorageService } from "@/lib/storageService";
import type { PetItem } from "@/types/mascota";

const STORAGE_KEY = "mascotas";

export const getMascotas = (): PetItem[] => {
  return StorageService.getItem<PetItem[]>(STORAGE_KEY) ?? [];
};

export const getMascotasByClienteId = (clienteId: number): PetItem[] => {
  const mascotas = getMascotas();

  return mascotas.filter((item) => item.owner.idOwner === clienteId);
};

export const saveMascotas = (mascotas: PetItem[]) => {
  StorageService.setItem(STORAGE_KEY, mascotas);
};
