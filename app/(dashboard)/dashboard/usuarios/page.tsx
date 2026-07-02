"use client";

import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";

import SectionHeader from "../_components/SectionHeader";
import UserTable from "./_components/UserTable";
import UserFormDialog from "./_components/UserFormDialog";
import {
  createUser,
  deleteUser,
  findAllUsers,
  updateUser,
} from "@/services/usuarios/userService";
import type { CreateUserRequest, UserItem } from "@/types/user";

const UsersPage = () => {
  const [usuarios, setUsuarios] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await findAllUsers();
      setUsuarios(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar la lista de usuarios.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleCreate = async (payload: CreateUserRequest) => {
    const createdUser = await createUser(payload);
    setUsuarios((current) => [...current, createdUser]);
  };

  const handleUpdate = async (id: number, payload: CreateUserRequest) => {
    const updatedUser = await updateUser(id, payload);
    setUsuarios((current) =>
      current.map((usuario) =>
        usuario.id_user === id ? updatedUser : usuario,
      ),
    );
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    setUsuarios((current) => current.filter((usuario) => usuario.id_user !== id));
  };

  return (
    <div className="max-w-295 px-4 mx-auto border flex flex-col gap-8 border-amber-500">
      <SectionHeader
        iconName="Icono Usuarios"
        iconLabel="Usuarios"
        title="Listado de usuarios"
        description="Vista donde podrás revisar y gestionar los usuarios"
        action={
          <UserFormDialog
            mode="create"
            icon={CirclePlus}
            buttonColor="success"
            onSubmit={handleCreate}
          />
        }
      />

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <UserTable
          usuarios={usuarios}
          loading={loading}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default UsersPage;
