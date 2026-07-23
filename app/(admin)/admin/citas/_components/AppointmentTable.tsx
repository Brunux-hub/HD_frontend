"use client";

import React, { useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import AppointmentFormDialog from "./AppointmentFormDialog";

import { Appointment, AppointmentRequest } from "@/types/appointment";
import { Pet } from "@/types/pet";
import { ClienteResponse } from "@/types/cliente";
import { Service } from "@/types/service";
import { Veterinarian } from "@/types/veterinarian";
import { AnimatedFrame } from "@/components/ui/animated-frame";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { ContextMenu } from "@/components/ui/context-menu";

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

const PAGE_SIZE = 10;

const AppointmentTable = ({ appointments, pets, clients, services, veterinarians, currentUserId, onEdit, onCancel }: Props) => {
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [editAppointment, setEditAppointment] = useState<Appointment | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const petMap = useMemo(() => new Map(pets.map((p) => [p.idMascota, p])), [pets]);
  const serviceMap = useMemo(() => new Map(services.map((s) => [s.idServicio, s])), [services]);

  const filtered = useMemo(() => {
    if (!search.trim()) return appointments;
    const q = search.toLowerCase();
    return appointments.filter((a) => {
      const petName = petMap.get(a.idMascota)?.nombre ?? "";
      const serviceName = serviceMap.get(a.idServicio)?.nombre ?? "";
      return petName.toLowerCase().includes(q) || serviceName.toLowerCase().includes(q) || a.motivo.toLowerCase().includes(q);
    });
  }, [appointments, search, petMap, serviceMap]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE), [filtered, safePage]);

  return (
    <div className="space-y-4">
      <DataTableToolbar searchValue={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar por mascota, servicio o motivo..." />

      <AnimatedFrame radius={16}>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mascota</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((a) => (
              <TableRow key={a.idCita} className="group">
                <TableCell className="font-medium">{petMap.get(a.idMascota)?.nombre ?? "—"}</TableCell>
                <TableCell>{serviceMap.get(a.idServicio)?.nombre ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{fmtDateTime(a.fechaProgramada)}</TableCell>
                <TableCell className="text-muted-foreground max-w-40 truncate">{a.motivo}</TableCell>
                <TableCell>
                  <Badge variant={a.estado}>{a.estado}</Badge>
                </TableCell>
                <TableCell>
                  <ContextMenu
                    actions={[
                      { label: "Editar", onClick: () => setEditAppointment(a) },
                      ...(a.estado === "PROGRAMADA" && onCancel
                        ? [{ label: "Cancelar cita", variant: "destructive" as const, onClick: () => setConfirmId(a.idCita) }]
                        : []),
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                  {search ? "No se encontraron resultados." : "No hay citas registradas."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </AnimatedFrame>

      {editAppointment && (
        <AppointmentFormDialog
          mode="edit"
          buttonColor="alert"
          data={editAppointment}
          pets={pets}
          clients={clients}
          services={services}
          veterinarians={veterinarians}
          currentUserId={currentUserId}
          open={true}
          onOpenChange={(v) => { if (!v) setEditAppointment(null); }}
          onSubmit={async (payload) => {
            await onEdit(editAppointment.idCita, payload);
            setEditAppointment(null);
          }}
        />
      )}

      <DataTablePagination currentPage={safePage} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <Dialog open={!!confirmId} onOpenChange={(v) => { if (!v) setConfirmId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="sr-only" />
          <DialogDescription className="sr-only" />
          <div className="py-4 text-center">
            <p className="text-base font-semibold">Cancelar cita</p>
            <p className="mt-1 text-sm text-muted-foreground">¿Estás seguro de cancelar esta cita?</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setConfirmId(null)}>No, volver</Button>
            <Button variant="destructive" onClick={async () => { if (confirmId && onCancel) await onCancel(confirmId); setConfirmId(null); }}>
              Sí, cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(AppointmentTable);
