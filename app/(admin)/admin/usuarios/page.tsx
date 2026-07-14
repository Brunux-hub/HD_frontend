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
  deleteUser,
  activateUser,
  deactivateUser,
  updatePassword,
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

  const handleUpdatePassword = async (id: number, data: { contraseniaActual: string; nuevaContrasenia: string }) => {
    await updatePassword(id, data);
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

  const handleActivate = async (id: number) => {
    await activateUser(id);
    await load();
  };

  const handleDeactivate = async (id: number) => {
    await deactivateUser(id);
    await load();
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Usuarios"
        iconLabel="Usuarios"
        title="Listado de usuarios"
        description="Vista donde podrás revisar y gestionar las cuentas de acceso."
        accent="teal"
      />

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex">
        <UserFormDialog
          mode="create"
          icon={CirclePlus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
      ) : (
        <UserTable
          users={users}
          onUpdatePassword={handleUpdatePassword}
          onDelete={handleDelete}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
        />
      )}
    </div>
  );
};

export default UsersPage;
