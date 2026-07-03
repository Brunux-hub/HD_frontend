"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import VetTable from "./_components/VetTable";
import VetFormDialog from "./_components/VetFormDialog";

import { Veterinarian, VeterinarianRequest } from "@/types/veterinarian";
import { Receptionist } from "@/types/receptionist";
import { User } from "@/types/user";
import {
  getVeterinarians,
  createVeterinarian,
  updateVeterinarian,
  deleteVeterinarian,
} from "@/services/veterinarians/veterinarians";
import { getReceptionists } from "@/services/receptionists/receptionists";
import { getUsers } from "@/services/users/users";

const VeterinariansPage = () => {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const assignedUserIds = useMemo(
    () => new Set([
      ...veterinarians.map((v) => v.user_response?.id_user).filter(Boolean),
      ...receptionists.map((r) => r.user?.id_user).filter(Boolean),
    ]),
    [veterinarians, receptionists],
  );
  const availableUsers = useMemo(
    () => users.filter((u) => !assignedUserIds.has(u.id_user)),
    [users, assignedUserIds],
  );
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [vetsData, receptionistsData, usersData] = await Promise.all([
        getVeterinarians(),
        getReceptionists(),
        getUsers(),
      ]);
      setVeterinarians(vetsData);
      setReceptionists(receptionistsData);
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
          users={availableUsers}
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
