"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import VetTable from "./_components/VetTable";
import VetFormDialog from "./_components/VetFormDialog";

import { Veterinarian, VeterinarianRequest } from "@/types/veterinarian";
import {
  getVeterinarians,
  createVeterinarian,
  updateVeterinarian,
  deleteVeterinarian,
} from "@/services/veterinarians/veterinarians";
import { activateUser, deactivateUser } from "@/services/users/users";

const VeterinariansPage = () => {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vetsData = await getVeterinarians();
      setVeterinarians(vetsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los veterinarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data: VeterinarianRequest) => {
    await createVeterinarian(data);
    await load();
  };

  const handleUpdate = async (id: number, data: VeterinarianRequest) => {
    await updateVeterinarian(id, data);
    await load();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVeterinarian(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el veterinario.");
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
        iconLabel="Veterinarios"
        title="Listado de veterinarios"
        description="Vista donde podrás revisar y gestionar a los veterinarios de la clínica."
        accent="teal"
      />

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex">
        <VetFormDialog
          mode="create"
          icon={CirclePlus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando veterinarios...</p>
      ) : (
        <VetTable
          veterinarians={veterinarians}
          onEdit={handleUpdate}
          onDelete={handleDelete}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
        />
      )}
    </div>
  );
};

export default VeterinariansPage;
