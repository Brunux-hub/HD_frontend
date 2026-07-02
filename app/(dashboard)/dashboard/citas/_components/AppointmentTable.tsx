"use client";

import { SquarePen, Trash } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import AppointmentFormDialog from "./AppointmentFormDialog";

import type {
  AppointmentItem,
  CreateAppointmentRequest,
} from "@/types/cita";
import type { PetItem } from "@/types/mascota";
import type { VeterinarianItem } from "@/types/veterinario";

type Props = {
  appointments: AppointmentItem[];
  pets: PetItem[];
  veterinarians: VeterinarianItem[];
  loading?: boolean;
  onEdit: (id: number, data: CreateAppointmentRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const statusLabel: Record<AppointmentItem["status"], string> = {
  OPENED: "Abierta",
  CLOSED: "Cerrada",
  CANCELED: "Cancelada",
  RESCHEDULED: "Reprogramada",
};

const AppointmentTable = ({
  appointments,
  pets,
  veterinarians,
  loading = false,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Table>
      <TableCaption>Lista de Citas</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Recepcionista</TableHead>
          <TableHead>Mascota</TableHead>
          <TableHead>Dueño</TableHead>
          <TableHead>Veterinario</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Duración</TableHead>
          <TableHead>Motivo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={10} className="text-center">
              Cargando citas...
            </TableCell>
          </TableRow>
        ) : appointments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={10} className="text-center">
              No hay citas para mostrar.
            </TableCell>
          </TableRow>
        ) : (
          appointments.map((appointment) => (
            <TableRow key={appointment.idAppointment}>
              <TableCell className="font-medium">{appointment.idAppointment}</TableCell>
              <TableCell>
                {appointment.receptionist
                  ? `${appointment.receptionist.names} ${appointment.receptionist.lastNames}`
                  : "Sin recepcionista"}
              </TableCell>
              <TableCell>{appointment.pet?.name ?? "Sin mascota"}</TableCell>
              <TableCell>{appointment.pet?.owner?.names ?? "Sin dueño"}</TableCell>
              <TableCell>
                {appointment.veterinarian
                  ? `${appointment.veterinarian.names} ${appointment.veterinarian.lastNames}`
                  : "Sin veterinario"}
              </TableCell>
              <TableCell>{appointment.date.slice(0, 10)}</TableCell>
              <TableCell>{appointment.timeMinutes} min</TableCell>
              <TableCell>{appointment.reason}</TableCell>
              <TableCell>{statusLabel[appointment.status]}</TableCell>
              <TableCell className="flex gap-2">
                <AppointmentFormDialog
                  appointments={appointments}
                  pets={pets}
                  veterinarians={veterinarians}
                  mode="edit"
                  icon={SquarePen}
                  buttonColor="alert"
                  data={appointment}
                  onSubmit={(data) => onEdit(appointment.idAppointment, data)}
                />
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const confirmar = window.confirm(
                      `¿Seguro que deseas eliminar la cita #${appointment.idAppointment}?`,
                    );

                    if (!confirmar) return;

                    await onDelete(appointment.idAppointment);
                  }}
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={10} className="text-center h-5"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default AppointmentTable;
