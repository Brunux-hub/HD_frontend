import { StorageService } from "@/lib/storageService";
import { Servicio } from "@/types/servicio";

const STORAGE_KEY = "servicios";

export const getServicios = (): Servicio[] => {
  return StorageService.getItem<Servicio[]>(STORAGE_KEY) ?? [];
};

export const saveServicios = (servicios: Servicio[]) => {
  StorageService.setItem(STORAGE_KEY, servicios);
};

export const createServicio = (servicio: Omit<Servicio, "id">): Servicio[] => {
  const servicios = getServicios();

  const nuevoServicio: Servicio = {
    id: Date.now(),
    ...servicio,
  };

  const serviciosActualizados = [...servicios, nuevoServicio];

  saveServicios(serviciosActualizados);

  return serviciosActualizados;
};

export const updateServicio = (
  id: number,
  servicio: Omit<Servicio, "id">,
): Servicio[] => {
  const servicios = getServicios();

  const serviciosActualizados = servicios.map((item) =>
    item.id === id ? { id, ...servicio } : item,
  );

  saveServicios(serviciosActualizados);

  return serviciosActualizados;
};

export const deleteServicio = (id: number): Servicio[] => {
  const servicios = getServicios();

  const serviciosActualizados = servicios.filter((item) => item.id !== id);

  saveServicios(serviciosActualizados);

  return serviciosActualizados;
};
