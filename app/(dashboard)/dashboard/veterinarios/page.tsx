"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import VetTable from "./_components/VetTable";
import VetFormDialog from "./_components/VetFormDialog";

import { Veterinarian, VeterinarianRequest } from "@/types/veterinarian";
import { User } from "@/types/user";
import {
  getVeterinarians,
  createVeterinarian,
  updateVeterinarian,
  deleteVeterinarian,
} from "@/services/veterinarians/veterinarians";
import { getUsers } from "@/services/users/users";

const VeterinariansPage = () => {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [vetsData, usersData] = await Promise.all([getVeterinarians(), getUsers()]);
      setVeterinarians(vetsData);
      setUsers(usersData);
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
          users={users}
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
          users={users}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default VeterinariansPage;
