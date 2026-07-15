"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import AppointmentTable from "./_components/AppointmentTable";
import AppointmentFormDialog from "./_components/AppointmentFormDialog";

import { Appointment, AppointmentRequest } from "@/types/appointment";
import { Pet } from "@/types/pet";
import { ClienteResponse } from "@/types/cliente";
import { Service } from "@/types/service";
import { Veterinarian } from "@/types/veterinarian";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
} from "@/services/appointments/appointments";
import { getPets } from "@/services/pets/pets";
import { getOwners } from "@/services/owners/owners";
import { getServices } from "@/services/services/services";
import { getVeterinarians } from "@/services/veterinarians/veterinarians";
import { getMe } from "@/services/auth/auth";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [clients, setClients] = useState<ClienteResponse[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [appointmentsData, petsData, clientsData, servicesData, vetsData, me] = await Promise.all([
        getAppointments(),
        getPets(),
        getOwners(),
        getServices(),
        getVeterinarians(),
        getMe(),
      ]);
      setAppointments(appointmentsData);
      setPets(petsData);
      setClients(clientsData);
      setServices(servicesData);
      setVeterinarians(vetsData);
      setCurrentUserId(me.idUsuario);
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

  const handleCancel = async (id: number) => {
    await updateAppointmentStatus(id, "CANCELADA");
    await load();
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
          clients={clients}
          services={services}
          veterinarians={veterinarians}
          currentUserId={currentUserId}
          onSubmit={handleCreate}
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando citas...</p>
      ) : (
        <AppointmentTable
          appointments={appointments}
          pets={pets}
          clients={clients}
          services={services}
          veterinarians={veterinarians}
          currentUserId={currentUserId}
          onEdit={handleUpdate}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
