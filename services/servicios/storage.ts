import { StorageService } from "@/lib/storageService";
import type { CreateServiceRequest, ServiceItem } from "@/types/servicio";

const STORAGE_KEY = "servicios";

export const getServicios = (): ServiceItem[] => {
  return StorageService.getItem<ServiceItem[]>(STORAGE_KEY) ?? [];
};

export const saveServicios = (servicios: ServiceItem[]) => {
  StorageService.setItem(STORAGE_KEY, servicios);
};

export const createServicio = (
  servicio: CreateServiceRequest,
): ServiceItem[] => {
  const servicios = getServicios();

  const nuevoServicio: ServiceItem = {
    idService: Date.now(),
    ...servicio,
  };

  const serviciosActualizados = [...servicios, nuevoServicio];

  saveServicios(serviciosActualizados);

  return serviciosActualizados;
};

export const updateServicio = (
  id: number,
  servicio: CreateServiceRequest,
): ServiceItem[] => {
  const servicios = getServicios();

  const serviciosActualizados = servicios.map((item) =>
    item.idService === id ? { idService: id, ...servicio } : item,
  );

  saveServicios(serviciosActualizados);

  return serviciosActualizados;
};

export const deleteServicio = (id: number): ServiceItem[] => {
  const servicios = getServicios();

  const serviciosActualizados = servicios.filter((item) => item.idService !== id);

  saveServicios(serviciosActualizados);

  return serviciosActualizados;
};
