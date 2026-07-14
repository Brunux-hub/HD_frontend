"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import ClientFormDialog from "./_components/ClientFormDialog";
import ClientTable from "./_components/ClientTable";

import { ClienteResponse, ClienteRequest } from "@/types/cliente";
import {
  createOwner,
  deleteOwner,
  getOwners,
} from "@/services/owners/owners";

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

  const handleDelete = async (id: number) => {
    try {
      await deleteOwner(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el cliente.");
    }
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Clientes"
        iconLabel="Clientes"
        title="Listado de clientes"
        description="Vista donde podrás revisar y gestionar los clientes"
        accent="teal"
      />

      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}

      <div className="flex">
        <ClientFormDialog
          mode="create"
          icon={CirclePlus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando clientes...</p>
      ) : (
        <ClientTable owners={owners} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default ClientsPage;
