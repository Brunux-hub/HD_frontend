"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import PetTable from "./_components/PetTable";
import PetFormDialog from "./_components/PetFormDialog";

import { Pet, PetRequest } from "@/types/pet";
import { Owner } from "@/types/owner";
import { getPets, createPet } from "@/services/pets/pets";
import { getOwners } from "@/services/owners/owners";

const PetsPage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
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

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Mascotas"
        iconLabel="Mascotas"
        title="Listado general de mascotas"
        description="Vista general de pacientes con su dueño y teléfono de contacto."
        accent="teal"
      />

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex">
        <PetFormDialog
          mode="create"
          owners={owners}
          icon={CirclePlus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando mascotas...</p>
      ) : (
        <PetTable pets={pets} showOwner />
      )}
    </div>
  );
};

export default PetsPage;
