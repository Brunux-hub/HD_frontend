"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Pet, PetRequest } from "@/types/pet";
import { ClienteResponse } from "@/types/cliente";
import { getPets, createPet, updatePet, activatePet, deactivatePet } from "@/services/pets/pets";
import { getOwners } from "@/services/owners/owners";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import PetTable from "./_components/PetTable";
import PetFormDialog from "./_components/PetFormDialog";

const PetsPage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [owners, setOwners] = useState<ClienteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [petsData, ownersData] = await Promise.all([getPets(), getOwners()]);
      setPets(petsData);
      setOwners(ownersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las mascotas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data: PetRequest) => {
    await createPet(data);
    await load();
  };

  const handleUpdatePet = async (id: number, data: PetRequest) => {
    await updatePet(id, data);
    await load();
  };

  const handleActivate = async (id: number) => {
    await activatePet(id);
    await load();
  };

  const handleDeactivate = async (id: number) => {
    await deactivatePet(id);
    await load();
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Mascotas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestiona las mascotas registradas.</p>
        </div>
        <PetFormDialog
          mode="create"
          owners={owners}
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
        <TableSkeleton columns={5} rows={6} />
      ) : (
        <PetTable pets={pets} showOwner owners={owners} onEdit={handleUpdatePet} onActivate={handleActivate} onDeactivate={handleDeactivate} />
      )}
    </div>
  );
};

export default PetsPage;
