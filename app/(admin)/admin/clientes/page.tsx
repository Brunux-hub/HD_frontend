"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { ClienteResponse, ClienteRequest } from "@/types/cliente";
import { getOwners, createOwner } from "@/services/owners/owners";
import { activateUser, deactivateUser } from "@/services/users/users";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import ClientTable from "./_components/ClientTable";
import ClientFormDialog from "./_components/ClientFormDialog";

const ClientsPage = () => {
  const [owners, setOwners] = useState<ClienteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOwners(await getOwners());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data: ClienteRequest) => {
    await createOwner(data);
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

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestiona los clientes registrados.</p>
        </div>
        <ClientFormDialog
          mode="create"
          icon={Plus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <TableSkeleton columns={6} rows={6} />
      ) : (
        <ClientTable owners={owners} onActivate={handleActivate} onDeactivate={handleDeactivate} />
      )}
    </div>
  );
};

export default ClientsPage;
