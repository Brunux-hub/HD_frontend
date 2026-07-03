"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import AppointmentTable from "./_components/AppointmentTable";
import AppointmentFormDialog from "./_components/AppointmentFormDialog";

import { Appointment, AppointmentRequest } from "@/types/appointment";
import { Pet } from "@/types/pet";
import { Veterinarian } from "@/types/veterinarian";
import { Receptionist } from "@/types/receptionist";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "@/services/appointments/appointments";
import { getPets } from "@/services/pets/pets";
import { getVeterinarians } from "@/services/veterinarians/veterinarians";
import { getReceptionists } from "@/services/receptionists/receptionists";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [appointmentsData, petsData, vetsData, receptionistsData] = await Promise.all([
        getAppointments(),
        getPets(),
        getVeterinarians(),
        getReceptionists(),
      ]);
      setAppointments(appointmentsData);
      setPets(petsData);
      setVeterinarians(vetsData);
      setReceptionists(receptionistsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las citas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data: AppointmentRequest) => {
    await createAppointment(data);
    await load();
  };

  const handleUpdate = async (id: number, data: AppointmentRequest) => {
    await updateAppointment(id, data);
    await load();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAppointment(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la cita.");
    }
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Citas"
        iconLabel="Citas"
        title="Listado de citas"
        description="Vista donde podrás revisar y gestionar las citas de la veterinaria."
        accent="teal"
      />

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex">
        <AppointmentFormDialog
          mode="create"
          icon={CirclePlus}
          buttonColor="success"
          pets={pets}
          veterinarians={veterinarians}
          receptionists={receptionists}
          onSubmit={handleCreate}
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando citas...</p>
      ) : (
        <AppointmentTable
          appointments={appointments}
          pets={pets}
          veterinarians={veterinarians}
          receptionists={receptionists}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
