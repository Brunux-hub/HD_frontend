"use client";

import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";

import SectionHeader from "../_components/SectionHeader";
import ReceptionistFormDialog from "./_components/ReceptionistFormDialog";
import ReceptionistTable from "./_components/ReceptionistTable";

import { findAllUsers } from "@/services/usuarios/userService";
import {
  createReceptionist,
  deleteReceptionist,
  findAllReceptionists,
  updateReceptionist,
} from "@/services/recepcionistas/receptionistService";
import type { UserItem } from "@/types/user";
import type {
  CreateReceptionistRequest,
  ReceptionistItem,
} from "@/types/recepcionista";

const ReceptionistsPage = () => {
  const [receptionists, setReceptionists] = useState<ReceptionistItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [receptionistsData, usersData] = await Promise.all([
          findAllReceptionists(),
          findAllUsers(),
        ]);
        setReceptionists(receptionistsData);
        setUsers(usersData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar la lista de recepcionistas.",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleCreate = async (data: CreateReceptionistRequest) => {
    const created = await createReceptionist(data);
    setReceptionists((current) => [...current, created]);
  };

  const handleUpdate = async (id: number, data: CreateReceptionistRequest) => {
    const updated = await updateReceptionist(id, data);
    setReceptionists((current) =>
      current.map((item) => (item.idReceptionist === id ? updated : item)),
    );
  };

  const handleDelete = async (id: number) => {
    await deleteReceptionist(id);
    setReceptionists((current) =>
      current.filter((item) => item.idReceptionist !== id),
    );
  };

  return (
    <div className="max-w-295 px-4 mx-auto border flex flex-col gap-8 border-amber-500">
      <SectionHeader
        iconName="Icono Recepcionistas"
        iconLabel="Recepcionistas"
        title="Listado de recepcionistas"
        description="Vista donde podrás revisar y gestionar los recepcionistas"
        action={
          <ReceptionistFormDialog
            users={users}
            mode="create"
            icon={CirclePlus}
            buttonColor="success"
            onSubmit={handleCreate}
          />
        }
      />

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <ReceptionistTable
          receptionists={receptionists}
          users={users}
          loading={loading}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ReceptionistsPage;
