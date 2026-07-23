"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

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
import AppointmentTable from "@/app/(admin)/admin/citas/_components/AppointmentTable";
import AppointmentFormDialog from "@/app/(admin)/admin/citas/_components/AppointmentFormDialog";
import { decodeToken } from "@/lib/auth";

const RecepcionistaCitasPage = () => {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Citas</h1>
          <p className="text-sm text-slate-500">Gestiona las citas de la veterinaria.</p>
        </div>
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

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

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

export default RecepcionistaCitasPage;
