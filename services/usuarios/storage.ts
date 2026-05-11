import { StorageService } from "@/lib/storageService";
import { Usuario } from "@/types/usuario";

const STORAGE_KEY = "usuarios";

export const getUsuarios = (): Usuario[] => {
  return StorageService.getItem<Usuario[]>(STORAGE_KEY) ?? [];
};

export const saveUsuarios = (usuarios: Usuario[]) => {
  StorageService.setItem(STORAGE_KEY, usuarios);
};

export const createUsuarios = (usuario: Omit<Usuario, "id">): Usuario[] => {
  const usuarios = getUsuarios();

  const nuevoUsuario: Usuario = {
    id: Date.now(),
    ...usuario,
  };

  const usuariosActualizados = [...usuarios, nuevoUsuario];

  saveUsuarios(usuariosActualizados);

  return usuariosActualizados;
};

export const updateUsuario = (
  id: number,
  usuario: Omit<Usuario, "id">,
): Usuario[] => {
  const usuarios = getUsuarios();

  const usuariosActualizados = usuarios.map((item) =>
    item.id === id ? { id, ...usuario } : item,
  );

  saveUsuarios(usuariosActualizados);

  return usuariosActualizados;
};

export const deleteUsuario = (id: number): Usuario[] => {
  const usuarios = getUsuarios();

  const usuariosActualizados = usuarios.filter((item) => item.id !== id);

  saveUsuarios(usuariosActualizados);

  return usuariosActualizados;
};
