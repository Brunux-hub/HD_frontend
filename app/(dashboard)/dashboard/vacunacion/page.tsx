"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import VaccinationTable from "./_components/VaccinationTable";
import VaccinationFormDialog from "./_components/VaccinationFormDialog";

import { Vaccination, VaccinationRequest } from "@/types/vaccination";
import { MedicalHistory } from "@/types/medicalHistory";
import { Vaccine } from "@/types/vaccine";
import {
  getVaccinations,
  createVaccination,
  updateVaccination,
  deleteVaccination,
} from "@/services/vaccinations/vaccinations";
import { getMedicalHistories } from "@/services/medicalHistories/medicalHistories";
import { getVaccines } from "@/services/vaccines/vaccines";

const VaccinationsPage = () => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [medicalHistories, setMedicalHistories] = useState<MedicalHistory[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [vaccinationsData, medicalHistoriesData, vaccinesData] = await Promise.all([
        getVaccinations(),
        getMedicalHistories(),
        getVaccines(),
      ]);
      setVaccinations(vaccinationsData);
      setMedicalHistories(medicalHistoriesData);
      setVaccines(vaccinesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las vacunaciones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data: VaccinationRequest) => {
    await createVaccination(data);
    await load();
  };

  const handleUpdate = async (id: number, data: VaccinationRequest) => {
    await updateVaccination(id, data);
    await load();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVaccination(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la vacunación.");
    }
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Servicios"
        iconLabel="Vacunación"
        title="Listado de vacunaciones"
        description="Vista donde podrás revisar y gestionar las vacunaciones aplicadas."
        accent="teal"
      />

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex">
        <VaccinationFormDialog
          mode="create"
          icon={CirclePlus}
          buttonColor="success"
          medicalHistories={medicalHistories}
          vaccines={vaccines}
          onSubmit={handleCreate}
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando vacunaciones...</p>
      ) : (
        <VaccinationTable
          vaccinations={vaccinations}
          medicalHistories={medicalHistories}
          vaccines={vaccines}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default VaccinationsPage;
