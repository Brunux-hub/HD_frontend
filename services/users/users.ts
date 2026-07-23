import { http } from "@/lib/axios";
import type { User, UserRequest } from "@/types/user";

// CRUD de usuarios (cuentas de acceso) contra el backend: /v1/usuarios
const BASE = "/v1/usuarios";

export const getUsers = async () => {
  const { data } = await http.get<User[]>(BASE);
  return data;
};

export const getUserById = async (id: number) => {
  const { data } = await http.get<User>(`${BASE}/${id}`);
  return data;
};

export const createUser = async (payload: UserRequest) => {
  const { data } = await http.post<User>(BASE, payload);
  return data;
};

export const updateUser = async (id: number, payload: UserRequest) => {
  const { data } = await http.put<User>(`${BASE}/${id}`, payload);
  return data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await http.delete(`${BASE}/${id}`);
};

export const activateUser = async (id: number): Promise<void> => {
  await http.patch(`/v1/usuarios/${id}/activar`);
};

export const deactivateUser = async (id: number): Promise<void> => {
  await http.patch(`/v1/usuarios/${id}/desactivar`);
};

export const updatePassword = async (id: number, payload: { contraseniaActual: string; nuevaContrasenia: string }): Promise<void> => {
  await http.patch(`/v1/usuarios/${id}/contrasenia`, payload);
};
