import { StorageService } from "@/lib/storageService";
import { Cliente } from "@/types/cliente";

const STORAGE_KEY = "clientes";

export const getClientes = (): Cliente[] => {
  return StorageService.getItem<Cliente[]>(STORAGE_KEY) ?? [];
};

export const saveClientes = (clientes: Cliente[]) => {
  StorageService.setItem(STORAGE_KEY, clientes);
};

export const createCliente = (cliente: Omit<Cliente, "id">): Cliente[] => {
  const clientes = getClientes();

  const nuevoCliente: Cliente = {
    id: Date.now(),
    ...cliente,
  };

  const clientesActualizados = [...clientes, nuevoCliente];

  saveClientes(clientesActualizados);

  return clientesActualizados;
};

export const updateCliente = (
  id: number,
  cliente: Omit<Cliente, "id">,
): Cliente[] => {
  const clientes = getClientes();

  const clientesActualizados = clientes.map((item) =>
    item.id === id ? { id, ...cliente } : item,
  );

  saveClientes(clientesActualizados);

  return clientesActualizados;
};

export const deleteCliente = (id: number): Cliente[] => {
  const clientes = getClientes();

  const clientesActualizados = clientes.filter((item) => item.id !== id);

  saveClientes(clientesActualizados);

  return clientesActualizados;
};
