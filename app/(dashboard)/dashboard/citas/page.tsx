"use client";

import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";

import SectionHeader from "../_components/SectionHeader";
import AppointmentFormDialog from "./_components/AppointmentFormDialog";
import AppointmentTable from "./_components/AppointmentTable";

import {
  createAppointment,
  deleteAppointment,
  findAllAppointments,
  updateAppointment,
} from "@/services/citas/appointmentService";
import { findAllPets } from "@/services/mascotas/petService";
import { findAllVeterinarians } from "@/services/veterinarios/veterinarianService";
import type { AppointmentItem, CreateAppointmentRequest } from "@/types/cita";
import type { PetItem } from "@/types/mascota";
import type { VeterinarianItem } from "@/types/veterinario";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [pets, setPets] = useState<PetItem[]>([]);
  const [veterinarians, setVeterinarians] = useState<VeterinarianItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [appointmentsData, petsData, veterinariansData] = await Promise.all([
        findAllAppointments(),
        findAllPets(),
        findAllVeterinarians(),
      ]);
      setAppointments(appointmentsData);
      setPets(petsData);
      setVeterinarians(veterinariansData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cargar la lista de citas.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleCreate = async (data: CreateAppointmentRequest) => {
    await createAppointment(data);
    await load();
  };

  const handleUpdate = async (id: number, data: CreateAppointmentRequest) => {
    await updateAppointment(id, data);
    await load();
  };

  const handleDelete = async (id: number) => {
    await deleteAppointment(id);
    setAppointments((current) =>
      current.filter((item) => item.idAppointment !== id),
    );
  };

  return (
    <div className="max-w-295 px-4 mx-auto border flex flex-col gap-8 border-amber-500">
      <SectionHeader
        iconName="Icono Citas"
        iconLabel="Citas"
        title="Listado de citas"
        description="Vista donde podrás revisar y gestionar las citas"
        action={
          <AppointmentFormDialog
            appointments={appointments}
            pets={pets}
            veterinarians={veterinarians}
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
        <AppointmentTable
          appointments={appointments}
          pets={pets}
          veterinarians={veterinarians}
          loading={loading}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
