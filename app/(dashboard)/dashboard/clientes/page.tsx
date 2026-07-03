"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CirclePlus, Search } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import ClientFormDialog from "./_components/ClientFormDialog";
import ClientTable from "./_components/ClientTable";
import { Input } from "@/components/ui/input";

import { Owner, OwnerRequest } from "@/types/owner";
import {
  createOwner,
  deleteOwner,
  getOwners,
} from "@/services/owners/owners";

const ClientsPage = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      search
        ? owners.filter(
            (o) =>
              (o.names ?? "").toLowerCase().includes(search) ||
              (o.last_names ?? "").toLowerCase().includes(search) ||
              (o.dni ?? "").includes(search),
          )
        : owners,
    [owners, search],
  );

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

  const handleCreate = async (data: OwnerRequest) => {
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
    <div className="flex flex-col gap-8">
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

      <div className="flex items-center justify-between gap-4">
        <ClientFormDialog
          mode="create"
          icon={CirclePlus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, apellido o N° de documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            className="w-80 pl-9"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando clientes...</p>
      ) : (
        <ClientTable owners={filtered} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default ClientsPage;
