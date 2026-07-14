"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import VaccineTable from "./_components/VaccineTable";
import VaccineFormDialog from "./_components/VaccineFormDialog";

import { Vaccine, VaccineRequest } from "@/types/vaccine";
import {
  getVaccines,
  createVaccine,
  updateVaccine,
  deleteVaccine,
} from "@/services/vaccines/vaccines";

const VaccinesPage = () => {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setVaccines(await getVaccines());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las vacunas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data: VaccineRequest) => {
    await createVaccine(data);
    await load();
  };

  const handleUpdate = async (id: number, data: VaccineRequest) => {
    await updateVaccine(id, data);
    await load();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVaccine(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la vacuna.");
    }
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Servicios"
        iconLabel="Vacunas"
        title="Listado de Vacunas"
        description="Vista donde podrás revisar y gestionar las vacunas."
        accent="teal"
      />

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex">
        <VaccineFormDialog
          mode="create"
          icon={CirclePlus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando vacunas...</p>
      ) : (
        <VaccineTable vaccines={vaccines} onEdit={handleUpdate} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default VaccinesPage;
