"use client";

import { useCallback, useEffect, useState } from "react";

import SectionHeader from "../_components/SectionHeader";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getCompletedServices, getAppointmentsByStatus } from "@/services/reports/reports";
import type { MedicalHistory } from "@/types/medicalHistory";
import type { Appointment } from "@/types/appointment";
import { AppointmentStatus } from "@/types/enums";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  PROGRAMADA: "Programada",
  EN_CURSO: "En curso",
  FINALIZADA: "Finalizada",
  CANCELED: "Cancelada",
  RESCHEDULED: "Reprogramada",
};

const fmtDate = (date?: string) => date?.slice(0, 16).replace("T", " ") ?? "";

const SectionCard = ({
  title,
  count,
  action,
  children,
}: {
  title: string;
  count?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card className="gap-4 p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        {count !== undefined && (
          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            {count} {count === 1 ? "registro" : "registros"}
          </span>
        )}
      </div>
      {action}
    </div>
    {children}
  </Card>
);

const ReportesPage = () => {
  // --- Servicios realizados ---
  const [services, setServices] = useState<MedicalHistory[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setServicesLoading(true);
    setServicesError(null);
    try {
      setServices(await getCompletedServices());
    } catch (err) {
      setServicesError(
        err instanceof Error ? err.message : "No se pudieron cargar los servicios realizados.",
      );
    } finally {
      setServicesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // --- Citas por estado ---
  const [status, setStatus] = useState<AppointmentStatus>("OPENED");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);

  const loadAppointments = useCallback(async (value: AppointmentStatus) => {
    setAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      setAppointments(await getAppointmentsByStatus(value));
    } catch (err) {
      setAppointmentsError(
        err instanceof Error ? err.message : "No se pudieron cargar las citas.",
      );
    } finally {
      setAppointmentsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments(status);
  }, [status, loadAppointments]);

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Servicios"
        iconLabel="Reportes"
        title="Reportes"
        description="Vista de solo lectura para consultar servicios realizados y citas por estado."
        accent="teal"
      />

      {/* Servicios realizados */}
      <SectionCard
        title="Servicios realizados"
        count={servicesLoading ? undefined : services.length}
      >
        {servicesError && (
          <p className="text-sm font-medium text-destructive">{servicesError}</p>
        )}
        {servicesLoading ? (
          <p className="text-sm text-muted-foreground">Cargando servicios realizados...</p>
        ) : services.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay servicios realizados.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cita</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((mh) => (
                <TableRow key={mh.id_medical_history}>
                  <TableCell>
                    #{mh.appointment?.id_appointment} {mh.appointment?.pet?.name}
                  </TableCell>
                  <TableCell>{mh.services?.name}</TableCell>
                  <TableCell className="whitespace-normal">{mh.description}</TableCell>
                  <TableCell>{fmtDate(mh.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      {/* Citas por estado */}
      <SectionCard
        title="Citas por estado"
        count={appointmentsLoading ? undefined : appointments.length}
        action={
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as AppointmentStatus)}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {(["PROGRAMADA", "EN_CURSO", "FINALIZADA", "CANCELADA"] as AppointmentStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        {appointmentsError && (
          <p className="text-sm font-medium text-destructive">{appointmentsError}</p>
        )}
        {appointmentsLoading ? (
          <p className="text-sm text-muted-foreground">Cargando citas...</p>
        ) : appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay citas con estado &quot;{STATUS_LABELS[status]}&quot;.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mascota</TableHead>
                <TableHead>Veterinario</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((a) => (
                <TableRow key={a.idCita}>
                  <TableCell>{a.motivo}</TableCell>
                  <TableCell>{fmtDate(a.fechaProgramada)}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                      {a.estado}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
};

export default ReportesPage;
