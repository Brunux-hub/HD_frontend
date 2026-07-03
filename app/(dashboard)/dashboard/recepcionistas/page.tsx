"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import ReceptionistTable from "./_components/ReceptionistTable";
import ReceptionistFormDialog from "./_components/ReceptionistFormDialog";

import { Receptionist, ReceptionistRequest } from "@/types/receptionist";
import { Veterinarian } from "@/types/veterinarian";
import { User } from "@/types/user";
import {
  getReceptionists,
  createReceptionist,
  updateReceptionist,
  deleteReceptionist,
} from "@/services/receptionists/receptionists";
import { getVeterinarians } from "@/services/veterinarians/veterinarians";
import { getUsers } from "@/services/users/users";

const ReceptionistsPage = () => {
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const assignedUserIds = useMemo(
    () => new Set([
      ...receptionists.map((r) => r.user?.id_user).filter(Boolean),
      ...veterinarians.map((v) => v.user_response?.id_user).filter(Boolean),
    ]),
    [receptionists, veterinarians],
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
      const [receptionistsData, vetsData, usersData] = await Promise.all([
        getReceptionists(),
        getVeterinarians(),
        getUsers(),
      ]);
      setReceptionists(receptionistsData);
      setVeterinarians(vetsData);
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los recepcionistas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data: ReceptionistRequest) => {
    await createReceptionist(data);
    await load();
  };

  const handleUpdate = async (id: number, data: ReceptionistRequest) => {
    await updateReceptionist(id, data);
    await load();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReceptionist(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el recepcionista.");
    }
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Usuarios"
        iconLabel="Recepcionistas"
        title="Listado de recepcionistas"
        description="Vista donde podrás revisar y gestionar al personal de recepción."
        accent="teal"
      />

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex">
        <ReceptionistFormDialog
          mode="create"
          users={availableUsers}
          icon={CirclePlus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando recepcionistas...</p>
      ) : (
        <ReceptionistTable
          receptionists={receptionists}
          users={users}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ReceptionistsPage;
