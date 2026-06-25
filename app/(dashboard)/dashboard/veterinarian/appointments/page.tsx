"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Eye, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/DataTable";
import SectionHeader from "../../_components/SectionHeader";

import { appointmentApi, veterinarianApi } from "@/api/endpoints";
import type { Appointment, Veterinarian } from "@/types/api";
import { useAuthStore } from "@/store/auth-store";

const statusStyles: Record<string, string> = {
  OPENED: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
  CLOSED: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
  CANCELED: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
  RESCHEDULED: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
};

const statusLabels: Record<string, string> = {
  OPENED: "Abierta",
  CLOSED: "Cerrada",
  CANCELED: "Cancelada",
  RESCHEDULED: "Reprogramada",
};

export default function AppointmentsPage() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [veterinarianId, setVeterinarianId] = useState<number | null>(null);
  const [vetError, setVetError] = useState(false);

  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    veterinarianApi
      .getAll()
      .then((res) => {
        const vets = res.data as Veterinarian[];
        const vet = vets.find((v) => v.user.id_user === user.id_user);
        if (vet) {
          setVeterinarianId(vet.id_veterinarian);
        } else {
          setVetError(true);
          setLoading(false);
        }
      })
      .catch(() => {
        toast.error("Error al cargar datos del veterinario");
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!veterinarianId) return;
    setLoading(true);
    appointmentApi
      .getAll()
      .then((res) => {
        const data = res.data as Appointment[];
        setAppointments(data.filter((a) => a.veterinarian.id_veterinarian === veterinarianId));
      })
      .catch(() => toast.error("Error al cargar citas"))
      .finally(() => setLoading(false));
  }, [veterinarianId]);

  const filtered = appointments.filter((a) => {
    if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
    if (dateFilter && a.date !== dateFilter) return false;
    return true;
  });

  const handleClose = () => {
    if (!selectedAppointment) return;
    setConfirmLoading(true);
    appointmentApi
      .update(selectedAppointment.id_appointment, { status: "CLOSED" })
      .then(() => {
        toast.success("Cita cerrada exitosamente");
        setAppointments((prev) =>
          prev.map((a) =>
            a.id_appointment === selectedAppointment.id_appointment
              ? { ...a, status: "CLOSED" as const }
              : a
          )
        );
        setSelectedAppointment((prev) =>
          prev ? { ...prev, status: "CLOSED" as const } : null
        );
        setConfirmOpen(false);
      })
      .catch(() => toast.error("Error al cerrar la cita"))
      .finally(() => setConfirmLoading(false));
  };

  const columns = [
    {
      key: "date",
      header: "Fecha",
      render: (item: Appointment) => format(new Date(item.date), "dd/MM/yyyy"),
    },
    {
      key: "pet_name",
      header: "Mascota",
      render: (item: Appointment) => item.pet.name,
    },
    {
      key: "owner",
      header: "Dueño",
      render: (item: Appointment) =>
        `${item.pet.owner.names} ${item.pet.owner.last_names}`,
    },
    {
      key: "reason",
      header: "Motivo",
      render: (item: Appointment) => (
        <span className="max-w-[200px] truncate block" title={item.reason}>
          {item.reason}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (item: Appointment) => (
        <Badge variant="outline" className={statusStyles[item.status]}>
          {statusLabels[item.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (item: Appointment) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedAppointment(item); setDetailOpen(true); }}>
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
        </div>
      ),
    },
  ];

  const tableData = filtered.map((a) => ({ ...a, id: a.id_appointment })) as any;

  if (vetError) {
    return (
      <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
        <SectionHeader
          iconName="Icono Citas"
          iconLabel="Citas"
          title="Mis Citas"
          description="Gestiona las citas asignadas a tu consulta"
        />
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No se encontró un perfil de veterinario asociado a tu usuario.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Citas"
        iconLabel="Citas"
        title="Mis Citas"
        description="Gestiona las citas asignadas a tu consulta"
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 flex-wrap items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">Fecha</label>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">Estado</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="OPENED">Abierta</SelectItem>
                <SelectItem value="CLOSED">Cerrada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(dateFilter || statusFilter !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setDateFilter(""); setStatusFilter("ALL"); }}
              className="h-9"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable
              columns={columns as any}
              data={tableData}
              searchable
              searchKeys={["reason"] as any}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle de la Cita</DialogTitle>
            <DialogDescription>
              Información completa de la cita seleccionada
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fecha</p>
                  <p className="font-medium">{format(new Date(selectedAppointment.date), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</p>
                  <Badge variant="outline" className={statusStyles[selectedAppointment.status]}>
                    {statusLabels[selectedAppointment.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mascota</p>
                  <p className="font-medium capitalize">{selectedAppointment.pet.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Especie / Raza</p>
                  <p className="font-medium">{selectedAppointment.pet.species} - {selectedAppointment.pet.race}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dueño</p>
                  <p className="font-medium">
                    {selectedAppointment.pet.owner.names} {selectedAppointment.pet.owner.last_names}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contacto</p>
                  <p className="font-medium">{selectedAppointment.pet.owner.phone_number}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Motivo</p>
                <p className="text-sm bg-muted p-3 rounded-md">{selectedAppointment.reason}</p>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Notas</p>
                  <p className="text-sm bg-muted p-3 rounded-md">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedAppointment?.status === "OPENED" && (
              <Button onClick={() => setConfirmOpen(true)}>
                Cerrar Cita
              </Button>
            )}
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar cierre</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cerrar esta cita? Una vez cerrada no podrá modificarse.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={confirmLoading}>
              Cancelar
            </Button>
            <Button onClick={handleClose} disabled={confirmLoading}>
              {confirmLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
