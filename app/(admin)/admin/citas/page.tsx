"use client";

import { useCallback, useEffect, useState } from "react";

import AppointmentTable from "./_components/AppointmentTable";

import { Appointment, AppointmentRequest } from "@/types/appointment";
import { Pet } from "@/types/pet";
import { ClienteResponse } from "@/types/cliente";
import { Service } from "@/types/service";
import { Veterinarian } from "@/types/veterinarian";
import {
  getAppointments,
  updateAppointment,
  updateAppointmentStatus,
} from "@/services/appointments/appointments";
import { getPets } from "@/services/pets/pets";
import { getOwners } from "@/services/owners/owners";
import { getServices } from "@/services/services/services";
import { getVeterinarians } from "@/services/veterinarians/veterinarians";
import { decodeToken } from "@/lib/auth";
import { TableSkeleton } from "@/components/ui/table-skeleton";

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
      const [appointmentsData, petsData, clientsData, servicesData, vetsData] = await Promise.all([
        getAppointments(),
        getPets(),
        getOwners(),
        getServices(),
        getVeterinarians(),
      ]);
      setAppointments(appointmentsData);
      setPets(petsData);
      setClients(clientsData);
      setServices(servicesData);
      setVeterinarians(vetsData);
      const token = decodeToken();
      setCurrentUserId(token?.idUsuario ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las citas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdate = async (id: number, data: AppointmentRequest) => {
    await updateAppointment(id, data);
    await load();
  };

  const handleCancel = async (id: number) => {
    await updateAppointmentStatus(id, "CANCELADA");
    await load();
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-6 px-4 py-6">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Citas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gestiona las citas de la veterinaria.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <TableSkeleton columns={6} rows={6} />
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
