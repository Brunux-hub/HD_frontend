"use client";

import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";

import SectionHeader from "../_components/SectionHeader";
import VeterinarianFormDialog from "./_components/VeterinarianFormDialog";
import VeterinarianTable from "./_components/VeterinarianTable";

import {
  createVeterinarian,
  deleteVeterinarian,
  findAllVeterinarians,
  updateVeterinarian,
} from "@/services/veterinarios/veterinarianService";
import { findAllUsers } from "@/services/usuarios/userService";
import type { UserItem } from "@/types/user";
import type {
  CreateVeterinarianRequest,
  VeterinarianItem,
} from "@/types/veterinario";

const VeterinariansPage = () => {
  const [veterinarians, setVeterinarians] = useState<VeterinarianItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [veterinariansData, usersData] = await Promise.all([
          findAllVeterinarians(),
          findAllUsers(),
        ]);
        setVeterinarians(veterinariansData);
        setUsers(usersData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar la lista de veterinarios.",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleCreate = async (data: CreateVeterinarianRequest) => {
    const created = await createVeterinarian(data);
    setVeterinarians((current) => [...current, created]);
  };

  const handleUpdate = async (id: number, data: CreateVeterinarianRequest) => {
    const updated = await updateVeterinarian(id, data);
    setVeterinarians((current) =>
      current.map((item) => (item.idVeterinarian === id ? updated : item)),
    );
  };

  const handleDelete = async (id: number) => {
    await deleteVeterinarian(id);
    setVeterinarians((current) =>
      current.filter((item) => item.idVeterinarian !== id),
    );
  };

  return (
    <div className="max-w-295 px-4 mx-auto border flex flex-col gap-8 border-amber-500">
      <SectionHeader
        iconName="Icono Veterinarios"
        iconLabel="Veterinarios"
        title="Listado de veterinarios"
        description="Vista donde podrás revisar y gestionar los veterinarios"
        action={
          <VeterinarianFormDialog
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
        <VeterinarianTable
          veterinarians={veterinarians}
          users={users}
          loading={loading}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default VeterinariansPage;
