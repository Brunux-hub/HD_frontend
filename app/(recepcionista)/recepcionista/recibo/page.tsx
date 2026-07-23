"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, ReceiptText } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import type { Appointment } from "@/types/appointment";
import type { Pet } from "@/types/pet";
import type { Service } from "@/types/service";
import { getAppointments } from "@/services/appointments/appointments";
import { getPets } from "@/services/pets/pets";
import { getServices } from "@/services/services/services";
import { printReceipt } from "@/lib/receipt-print";

const fmtDateTime = (iso: string) => {
  if (!iso) return "—";

  const date = new Date(iso.slice(0, 16));
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

const RecepcionistaReciboPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [printingId, setPrintingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [appointmentsData, petsData, servicesData] = await Promise.all([
        getAppointments(),
        getPets(),
        getServices(),
      ]);

      setAppointments(appointmentsData);
      setPets(petsData);
      setServices(servicesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los recibos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const petMap = useMemo(() => new Map(pets.map((pet) => [pet.idMascota, pet])), [pets]);
  const serviceMap = useMemo(
    () => new Map(services.map((service) => [service.idServicio, service])),
    [services],
  );

  const finalAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.estado === "FINALIZADA"),
    [appointments],
  );

  const handlePrint = (appointment: Appointment) => {
    try {
      setPrintingId(appointment.idCita);
      printReceipt({
        appointment,
        pet: petMap.get(appointment.idMascota),
        service: serviceMap.get(appointment.idServicio),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo abrir la ventana de impresión del recibo.",
      );
    } finally {
      setPrintingId(null);
    }
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recibo</h1>
        <p className="text-sm text-slate-500">
          Genera comprobantes a partir de las citas finalizadas.
        </p>
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando recibos...
        </div>
      ) : finalAppointments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay citas finalizadas para generar recibos.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Mascota</TableHead>
              <TableHead className="text-left">Servicio</TableHead>
              <TableHead className="text-left">Fecha</TableHead>
              <TableHead className="text-left">Estado</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {finalAppointments.map((appointment) => (
              <TableRow key={appointment.idCita}>
                <TableCell className="text-left font-medium">
                  {petMap.get(appointment.idMascota)?.nombre ?? "—"}
                </TableCell>
                <TableCell className="text-left">
                  {serviceMap.get(appointment.idServicio)?.nombre ?? "—"}
                </TableCell>
                <TableCell className="text-left text-muted-foreground">
                  {fmtDateTime(appointment.fechaProgramada)}
                </TableCell>
                <TableCell className="text-left">
                  {appointment.estado}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      className="h-9 w-9 rounded-lg bg-sky-100 p-0 text-sky-800 hover:bg-sky-200"
                      onClick={() => handlePrint(appointment)}
                      disabled={printingId === appointment.idCita}
                    >
                      {printingId === appointment.idCita ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ReceiptText className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default RecepcionistaReciboPage;
