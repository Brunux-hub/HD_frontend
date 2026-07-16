"use client";

import { useState } from "react";
import { SquarePen } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import AppointmentFormDialog from "./AppointmentFormDialog";

import { Appointment, AppointmentRequest } from "@/types/appointment";
import { Pet } from "@/types/pet";
import { ClienteResponse } from "@/types/cliente";
import { Service } from "@/types/service";
import { Veterinarian } from "@/types/veterinarian";

const fmtDateTime = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso.slice(0, 16));
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

const statusClassName = (status: string) =>
  status === "CANCELADA"
    ? "rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300"
    : "rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300";

type Props = {
  appointments: Appointment[];
  pets: Pet[];
  clients: ClienteResponse[];
  services: Service[];
  veterinarians: Veterinarian[];
  currentUserId: number;
  onEdit: (id: number, appointment: AppointmentRequest) => void;
  onCancel?: (id: number) => Promise<void>;
};

const AppointmentTable = ({ appointments, pets, clients, services, veterinarians, currentUserId, onEdit, onCancel }: Props) => {
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const petMap = new Map(pets.map((p) => [p.idMascota, p]));
  const serviceMap = new Map(services.map((s) => [s.idServicio, s]));

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mascota</TableHead>
            <TableHead>Servicio</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-40"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.idCita}>
              <TableCell>{petMap.get(appointment.idMascota)?.nombre ?? "—"}</TableCell>
              <TableCell>{serviceMap.get(appointment.idServicio)?.nombre ?? "—"}</TableCell>
              <TableCell>{fmtDateTime(appointment.fechaProgramada)}</TableCell>
              <TableCell>{appointment.motivo}</TableCell>
              <TableCell>
                <span className={statusClassName(appointment.estado)}>
                  {appointment.estado}
                </span>
              </TableCell>
              <TableCell className="flex gap-2">
                <AppointmentFormDialog
                  icon={SquarePen}
                  mode="edit"
                  buttonColor="alert"
                  data={appointment}
                  pets={pets}
                  clients={clients}
                  services={services}
                  veterinarians={veterinarians}
                  currentUserId={currentUserId}
                  onSubmit={(payload) => onEdit(appointment.idCita, payload)}
                />
                {appointment.estado === "PROGRAMADA" && onCancel && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmId(appointment.idCita)}
                  >
                    Cancelar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7} className="h-5 text-center"></TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Dialog open={!!confirmId} onOpenChange={(v) => { if (!v) setConfirmId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="sr-only" />
          <DialogDescription className="sr-only" />
          <div className="py-4 text-center">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Cancelar cita</p>
            <p className="mt-2 text-sm text-slate-500">¿Estás seguro de cancelar esta cita?</p>
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setConfirmId(null)}>
              No, volver
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (confirmId && onCancel) await onCancel(confirmId);
                setConfirmId(null);
              }}
            >
              Sí, cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentTable;
