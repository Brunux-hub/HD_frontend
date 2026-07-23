"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import { Pet, PetRequest } from "@/types/pet";
import { ClienteResponse } from "@/types/cliente";
import { getPets, createPet, updatePet, activatePet, deactivatePet } from "@/services/pets/pets";
import { getOwners } from "@/services/owners/owners";
import PetTable from "@/app/(admin)/admin/mascotas/_components/PetTable";
import PetFormDialog from "@/app/(admin)/admin/mascotas/_components/PetFormDialog";

const RecepcionistaMascotasPage = () => {
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

  const handleUpdate = async (id: number, data: PetRequest) => {
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
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mascotas</h1>
          <p className="text-sm text-slate-500">Gestiona las mascotas registradas.</p>
        </div>
        <PetFormDialog
          mode="create"
          owners={owners}
          icon={CirclePlus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando mascotas...</p>
      ) : (
        <PetTable pets={pets} showOwner owners={owners} onEdit={handleUpdate} onActivate={handleActivate} onDeactivate={handleDeactivate} />
      )}
    </div>
  );
};

export default RecepcionistaMascotasPage;
