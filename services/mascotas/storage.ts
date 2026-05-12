import { StorageService } from "@/lib/storageService";
import { Mascota } from "@/types/mascota";

const STORAGE_KEY = "mascotas";

export const getMascotas = (): Mascota[] => {
  return StorageService.getItem<Mascota[]>(STORAGE_KEY) ?? [];
};

export const getMascotasByClienteId = (clienteId: number): Mascota[] => {
  const mascotas = getMascotas();

  return mascotas.filter((item) => item.clienteId === clienteId);
};

export const saveMascotas = (mascotas: Mascota[]) => {
  StorageService.setItem(STORAGE_KEY, mascotas);
};

export const createMascota = (mascota: Omit<Mascota, "id">): Mascota[] => {
  const mascotas = getMascotas();

  const nuevaMascota: Mascota = {
    id: Date.now(),
    ...mascota,
  };

  const mascotasActualizadas = [...mascotas, nuevaMascota];

  saveMascotas(mascotasActualizadas);

  return mascotasActualizadas;
};

export const updateMascota = (
  id: number,
  mascota: Omit<Mascota, "id">,
): Mascota[] => {
  const mascotas = getMascotas();

  const mascotasActualizadas = mascotas.map((item) =>
    item.id === id ? { id, ...mascota } : item,
  );

  saveMascotas(mascotasActualizadas);

  return mascotasActualizadas;
};

export const deleteMascota = (id: number): Mascota[] => {
  const mascotas = getMascotas();

  const mascotasActualizadas = mascotas.filter((item) => item.id !== id);

  saveMascotas(mascotasActualizadas);

  return mascotasActualizadas;
};
