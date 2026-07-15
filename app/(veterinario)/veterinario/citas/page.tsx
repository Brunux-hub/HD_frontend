"use client";

import { useCallback, useEffect, useState } from "react";

import { Appointment } from "@/types/appointment";
import { Pet } from "@/types/pet";
import { Service } from "@/types/service";
import { getCitasByVeterinario } from "@/services/veterinario/citas";
import { getPets } from "@/services/pets/pets";
import { getServices } from "@/services/services/services";
import { getMe } from "@/services/auth/auth";
import { updateAppointmentStatus } from "@/services/appointments/appointments";
import GestionCitaDialog from "./_components/GestionCitaDialog";

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

const ESTADO_STYLES: Record<string, string> = {
  PROGRAMADA: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  EN_CURSO: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  FINALIZADA: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  CANCELADA: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const VeterinarioCitasPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [, setVeterinarioId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gestionCitaId, setGestionCitaId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await getMe();
      setVeterinarioId(me.idUsuario);
      const [citasData, petsData, servicesData] = await Promise.all([
        getCitasByVeterinario(me.idUsuario),
        getPets(),
        getServices(),
      ]);
      setAppointments(citasData);
      setPets(petsData);
      setServices(servicesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las citas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleGestionar = async (appointment: Appointment) => {
    if (appointment.estado === "PROGRAMADA") {
      await updateAppointmentStatus(appointment.idCita, "EN_CURSO");
      await load();
    }
    setGestionCitaId(appointment.idCita);
    setDialogOpen(true);
  };

  const handleMinimize = () => {
    setDialogOpen(false);
  };

  const handleFinalizar = async () => {
    if (gestionCitaId) {
      await updateAppointmentStatus(gestionCitaId, "FINALIZADA");
      setGestionCitaId(null);
      setDialogOpen(false);
      await load();
    }
  };

  const petMap = new Map(pets.map((p) => [p.idMascota, p]));
  const serviceMap = new Map(services.map((s) => [s.idServicio, s]));
  const gestionCita = appointments.find((a) => a.idCita === gestionCitaId) ?? null;

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Citas</h1>
        <p className="text-sm text-slate-500">Gestiona tus citas asignadas.</p>
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando citas...</p>
      ) : appointments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tienes citas asignadas.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-teal-100 bg-card shadow-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-teal-100">
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Mascota</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Servicio</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Motivo</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.idCita} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{petMap.get(a.idMascota)?.nombre ?? "—"}</td>
                  <td className="px-4 py-3">{serviceMap.get(a.idServicio)?.nombre ?? "—"}</td>
                  <td className="px-4 py-3">{fmtDateTime(a.fechaProgramada)}</td>
                  <td className="px-4 py-3">{a.motivo}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ESTADO_STYLES[a.estado] ?? ""}`}>
                      {a.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {(a.estado === "PROGRAMADA" || a.estado === "EN_CURSO") && (
                      <button
                        onClick={() => handleGestionar(a)}
                        className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
                      >
                        Gestionar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {gestionCita && (
        <GestionCitaDialog
          cita={gestionCita}
          open={dialogOpen}
          onMinimize={handleMinimize}
          onFinalizar={handleFinalizar}
        />
      )}
    </div>
  );
};

export default VeterinarioCitasPage;