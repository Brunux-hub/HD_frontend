"use client";

import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";

import SectionHeader from "../_components/SectionHeader";
import PetTable from "./_components/PetTable";
import PetFormDialog from "./_components/PetFormDialog";

import { getOwners } from "@/services/owners/owners";
import {
  createPet,
  deletePet,
  findAllPets,
  updatePet,
} from "@/services/mascotas/petService";
import type { Owner } from "@/types/owner";
import type { CreatePetRequest, PetItem } from "@/types/mascota";

const PetsPage = () => {
  const [mascotas, setMascotas] = useState<PetItem[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [petsData, ownersData] = await Promise.all([findAllPets(), getOwners()]);
        setMascotas(petsData);
        setOwners(ownersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudieron cargar las mascotas.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleCreate = async (data: CreatePetRequest) => {
    const createdPet = await createPet(data);
    setMascotas((current) => [...current, createdPet]);
  };

  const handleUpdate = async (id: number, data: CreatePetRequest) => {
    const updatedPet = await updatePet(id, data);
    setMascotas((current) =>
      current.map((pet) => (pet.idPet === id ? updatedPet : pet)),
    );
  };

  const handleDelete = async (id: number) => {
    await deletePet(id);
    setMascotas((current) => current.filter((pet) => pet.idPet !== id));
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Mascotas"
        iconLabel="Mascotas"
        title="Listado general de mascotas"
        description="Vista general de pacientes con su dueño principal y telefono de contacto."
        action={
          <PetFormDialog
            owners={owners}
            mode="create"
            icon={CirclePlus}
            buttonColor="success"
            onSubmit={handleCreate}
          />
        }
      />

      {error ? (
        <p className="text-sm font-medium text-destructive">{error}</p>
      ) : (
        <PetTable
          mascotas={mascotas}
          owners={owners}
          showOwner
          showHistoryLink
          caption={loading ? "Cargando mascotas..." : "Mascotas registradas en la veterinaria"}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default PetsPage;
