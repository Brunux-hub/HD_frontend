"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import MedicalHistoryTable from "./_components/MedicalHistoryTable";
import MedicalHistoryFormDialog from "./_components/MedicalHistoryFormDialog";

import { MedicalHistory, MedicalHistoryRequest } from "@/types/medicalHistory";
import { Appointment } from "@/types/appointment";
import { Service } from "@/types/service";
import { Pet } from "@/types/pet";
import {
  getMedicalHistories,
  createMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
} from "@/services/medicalHistories/medicalHistories";
import { getAppointments } from "@/services/appointments/appointments";
import { getPets } from "@/services/pets/pets";
import { getServices } from "@/services/services/services";

const MedicalHistoriesPage = () => {
  const [medicalHistories, setMedicalHistories] = useState<MedicalHistory[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [historiesData, appointmentsData, petsData, servicesData] = await Promise.all([
        getMedicalHistories(),
        getAppointments(),
        getPets(),
        getServices(),
      ]);
      setMedicalHistories(historiesData);
      setAppointments(appointmentsData);
      setPets(petsData)
      setServices(servicesData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar los historiales médicos.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data: MedicalHistoryRequest) => {
    await createMedicalHistory(data);
    await load();
  };

  const handleUpdate = async (id: number, data: MedicalHistoryRequest) => {
    await updateMedicalHistory(id, data);
    await load();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMedicalHistory(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el historial médico.");
    }
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Servicios"
        iconLabel="Historial médico"
        title="Listado de historiales médicos"
        description="Vista donde podrás revisar y gestionar los historiales médicos de los pacientes."
        accent="teal"
      />

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex">
        <MedicalHistoryFormDialog
          mode="create"
          appointments={appointments}
          pets={pets}
          services={services}
          icon={CirclePlus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando historiales médicos...</p>
      ) : (
        <MedicalHistoryTable
          medicalHistories={medicalHistories}
          appointments={appointments}
          pets={pets}
          services={services}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default MedicalHistoriesPage;
