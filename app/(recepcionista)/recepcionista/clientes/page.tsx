"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import { ClienteResponse, ClienteRequest } from "@/types/cliente";
import {
  getOwners,
  createOwner,
} from "@/services/owners/owners";
import { activateUser, deactivateUser } from "@/services/users/users";
import ClientTable from "@/app/(admin)/admin/clientes/_components/ClientTable";
import ClientFormDialog from "@/app/(admin)/admin/clientes/_components/ClientFormDialog";

const RecepcionistaClientesPage = () => {
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
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clientes</h1>
          <p className="text-sm text-slate-500">Gestiona los clientes registrados.</p>
        </div>
        <ClientFormDialog
          mode="create"
          icon={CirclePlus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando clientes...</p>
      ) : (
        <ClientTable owners={owners} onActivate={handleActivate} onDeactivate={handleDeactivate} />
      )}
    </div>
  );
};

export default RecepcionistaClientesPage;
