"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import UserTable from "./_components/UserTable";
import UserFormDialog from "./_components/UserFormDialog";

import { User, UserRequest } from "@/types/user";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/users/users";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await getUsers());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data: UserRequest) => {
    await createUser(data);
    await load();
  };

  const handleUpdate = async (id: number, data: UserRequest) => {
    await updateUser(id, data);
    await load();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el usuario.");
    }
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Usuarios"
        iconLabel="Usuarios"
        title="Listado de usuarios"
        description="Vista donde podrás revisar y gestionar las cuentas de acceso."
        action={
          <UserFormDialog
            mode="create"
            icon={CirclePlus}
            buttonColor="success"
            onSubmit={handleCreate}
          />
        }
      />

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
      ) : (
        <UserTable users={users} onEdit={handleUpdate} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default UsersPage;
