"use client";

import { useEffect, useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import AppointmentFormDialog from "./AppointmentFormDialog";

import { Appointment, AppointmentRequest } from "@/types/appointment";
import { Pet } from "@/types/pet";
import { Veterinarian } from "@/types/veterinarian";
import { AppointmentStatus } from "@/types/enums";
import { fmtDateTime } from "@/lib/utils";
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



type Props = {
  appointments: Appointment[];
  pets: Pet[];
  veterinarians: Veterinarian[];
  onEdit: (id: number, appointment: AppointmentRequest) => void;
  onDelete: (id: number) => void;
};

const PAGE_SIZE = 8;

const AppointmentTable = ({
  appointments,
  pets,
  veterinarians,
  onEdit,
  onDelete,
}: Props) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(appointments.length / PAGE_SIZE);
  const paginated = appointments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Mascota</TableHead>
          <TableHead>Veterinario</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((appointment) => (
          <TableRow key={appointment.id_appointment}>
            <TableCell className="font-medium">{appointment.id_appointment}</TableCell>
            <TableCell>{appointment.pet.name}</TableCell>
            <TableCell>
              {appointment.veterinarian.names} {appointment.veterinarian.last_names}
            </TableCell>
            <TableCell>{fmtDateTime(appointment.date)}</TableCell>
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
      {totalPages > 1 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="py-3">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};

export default AppointmentTable;
