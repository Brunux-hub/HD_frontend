"use client";

import { SquarePen, Trash } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import AppointmentFormDialog from "./AppointmentFormDialog";

import { Appointment, AppointmentRequest } from "@/types/appointment";
import { Pet } from "@/types/pet";
import { Veterinarian } from "@/types/veterinarian";
import { Receptionist } from "@/types/receptionist";
import { AppointmentStatus } from "@/types/enums";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  OPENED: "Abierta",
  CLOSED: "Cerrada",
  CANCELED: "Cancelada",
  RESCHEDULED: "Reprogramada",
};

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  OPENED: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  CLOSED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  CANCELED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  RESCHEDULED: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

const fmtDateTime = (iso: string) => (iso ? iso.slice(0, 16).replace("T", " ") : "—");

type Props = {
  appointments: Appointment[];
  pets: Pet[];
  veterinarians: Veterinarian[];
  receptionists: Receptionist[];
  onEdit: (id: number, appointment: AppointmentRequest) => void;
  onDelete: (id: number) => void;
};

const AppointmentTable = ({
  appointments,
  pets,
  veterinarians,
  receptionists,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mascota</TableHead>
          <TableHead>Veterinario</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Duración</TableHead>
          <TableHead>Motivo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="w-32"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id_appointment}>
            <TableCell>{appointment.pet.name}</TableCell>
            <TableCell>
              {appointment.veterinarian.names} {appointment.veterinarian.last_names}
            </TableCell>
            <TableCell>{fmtDateTime(appointment.date)}</TableCell>
            <TableCell>{appointment.time_minutes} min</TableCell>
            <TableCell>{appointment.reason}</TableCell>
            <TableCell>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[appointment.status]}`}
              >
                {STATUS_LABELS[appointment.status]}
              </span>
            </TableCell>
            <TableCell className="flex justify-between gap-2">
              <AppointmentFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                data={appointment}
                pets={pets}
                veterinarians={veterinarians}
                receptionists={receptionists}
                onSubmit={(payload) => onEdit(appointment.id_appointment, payload)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const ok = window.confirm(
                    `¿Seguro que deseas eliminar la cita de "${appointment.pet.name}"?`,
                  );
                  if (!ok) return;
                  onDelete(appointment.id_appointment);
                }}
              >
                <Trash />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={8} className="h-5 text-center"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default AppointmentTable;
