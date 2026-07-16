"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { User, UserRequest } from "@/types/user";
import {
  getUsers,
  createUser,
  activateUser,
  deactivateUser,
  updatePassword,
} from "@/services/users/users";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import UserTable from "./_components/UserTable";
import UserFormDialog from "./_components/UserFormDialog";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);

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

  const handleActivate = async (id: number) => {
    await activateUser(id);
    await load();
  };

  const handleDeactivate = async (id: number) => {
    await deactivateUser(id);
    await load();
  };

  const handleChangePassword = async (payload: { contraseniaActual: string; nuevaContrasenia: string }) => {
    if (!editUser) return;
    await updatePassword(editUser.idUsuario, payload);
    setEditUser(null);
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Usuarios</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestiona las cuentas de acceso.</p>
        </div>
        <UserFormDialog
          mode="create"
          icon={Plus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
        <UserFormDialog
          mode="edit"
          data={editUser ?? undefined}
          open={!!editUser}
          onOpenChange={(v) => { if (!v) setEditUser(null); }}
          onSubmit={handleChangePassword}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <TableSkeleton columns={3} rows={6} />
      ) : (
        <UserTable users={users} onActivate={handleActivate} onDeactivate={handleDeactivate} onChangePassword={setEditUser} />
      )}
    </div>
  );
};

export default UsersPage;
