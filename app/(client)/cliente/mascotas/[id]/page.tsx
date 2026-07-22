"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ClipboardList, Stethoscope, Calendar, Weight, FileText, Loader2, Printer } from "lucide-react";

import { getClientData, edadEnAnios, type Mascota } from "@/lib/cliente/data";
import { getRecetasByRegistro, getRegistrosMedicos } from "@/services/registrosMedicos/registrosMedicos";
import { getAppointmentById } from "@/services/appointments/appointments";
import { getServices } from "@/services/services/services";
import { getItemsByReceta } from "@/services/recetas/recetas";
import { printPrescription } from "@/lib/prescription-print";
import type { RegistroMedico } from "@/types/registroMedico";
import type { Appointment } from "@/types/appointment";
import type { Service } from "@/types/service";
import { Button } from "@/components/ui/button";
import PetAvatar from "../../../_components/PetAvatar";

const fmt = (iso: string | null) =>
  iso
    ? new Date(iso.slice(0, 10) + "T00:00:00").toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

type RegistroConDetalle = RegistroMedico & {
  motivo: string;
  servicio: string;
};

export default function MascotaDetalle() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [loading, setLoading] = useState(true);
  const [historial, setHistorial] = useState<RegistroConDetalle[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState(true);
  const [printingRegistroId, setPrintingRegistroId] = useState<number | null>(null);
  const [printError, setPrintError] = useState<string | null>(null);

  useEffect(() => {
    getClientData()
      .then(({ mascotas }) => setMascota(mascotas.find((m) => m.id === id) ?? null))
      .catch(() => setMascota(null))
      .finally(() => setLoading(false));
  }, [id]);

  const loadHistorial = useCallback(async () => {
    setLoadingHistorial(true);
    try {
      const [allRegistros, allServicios] = await Promise.all([
        getRegistrosMedicos(),
        getServices(),
      ]);

      const serviciosMap = new Map<number, Service>();
      for (const s of allServicios) serviciosMap.set(s.idServicio, s);

      const apps = await Promise.all(
        allRegistros.map((r) =>
          getAppointmentById(r.idCita)
            .then((app) => ({ app, registro: r }))
            .catch(() => null),
        ),
      );

      const filtrados = apps
        .filter((item): item is { app: Appointment; registro: RegistroMedico } =>
          item !== null && item.app.idMascota === id,
        )
        .map(({ app, registro }) => ({
          ...registro,
          motivo: app.motivo,
          servicio: serviciosMap.get(app.idServicio)?.nombre ?? "—",
        }))
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

      setHistorial(filtrados);
    } catch {
      setHistorial([]);
    } finally {
      setLoadingHistorial(false);
    }
  }, [id]);

  useEffect(() => {
    loadHistorial();
  }, [loadHistorial]);

  const handlePrintPrescription = useCallback(async (registro: RegistroMedico) => {
    try {
      setPrintError(null);
      setPrintingRegistroId(registro.idRegistroMedico);

      const recetas = await getRecetasByRegistro(registro.idRegistroMedico);
      const receta = recetas[0];

      if (!receta) {
        setPrintError("Este control no tiene recetas registradas.");
        return;
      }

      const items = await getItemsByReceta(receta.idReceta);

      printPrescription({
        receta,
        items,
        registro,
      });
    } catch (err) {
      setPrintError(
        err instanceof Error
          ? err.message
          : "No se pudo abrir la impresión de la receta.",
      );
    } finally {
      setPrintingRegistroId(null);
    }
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando...</p>;
  }

  if (!mascota) {
    return (
      <div className="space-y-4">
        <Link href="/cliente/mascotas" className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          Mascota no encontrada.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/cliente/mascotas" className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Mis mascotas
      </Link>

      {/* Cabecera */}
      <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <PetAvatar name={mascota.nombre} className="h-28 w-28 text-4xl" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{mascota.nombre}</h1>
          <p className="text-sm text-slate-500">
            {mascota.especie} · {mascota.raza} · {mascota.sexo === "HEMBRA" ? "Hembra" : "Macho"}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400">Edad</p>
              <p className="font-medium text-slate-700 dark:text-slate-200">{edadEnAnios(mascota.nacimiento)} años</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Nacimiento</p>
              <p className="font-medium text-slate-700 dark:text-slate-200">{fmt(mascota.nacimiento)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Historial Médico */}
      <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <ClipboardList className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Historial Médico</h2>
        </div>

        {printError && (
          <div className="px-6 pt-4">
            <p className="text-sm font-medium text-destructive">{printError}</p>
          </div>
        )}

        {loadingHistorial ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
          </div>
        ) : historial.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-400">
            No hay registros médicos para esta mascota.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {historial.map((r) => (
              <div key={r.idRegistroMedico} className="px-6 py-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-teal-600">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="font-medium">{fmt(r.fecha)}</span>
                  </div>
                  <Button
                    type="button"
                    className="gap-2 bg-sky-100 text-sky-800 hover:bg-sky-200"
                    onClick={() => void handlePrintPrescription(r)}
                    disabled={printingRegistroId === r.idRegistroMedico}
                  >
                    {printingRegistroId === r.idRegistroMedico ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Printer className="h-4 w-4" />
                    )}
                    Imprimir receta
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Stethoscope className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-200">{r.servicio}</span>
                </div>

                <p className="text-sm text-slate-500 ml-5.5">
                  <span className="text-xs text-slate-400">Motivo: </span>
                  {r.motivo}
                </p>

                {r.diagnostico && (
                  <p className="text-sm text-slate-500 ml-5.5">
                    <span className="text-xs text-slate-400">Diagnóstico: </span>
                    {r.diagnostico}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 ml-5.5 text-sm text-slate-500">
                  {r.peso != null && (
                    <span className="flex items-center gap-1">
                      <Weight className="h-3.5 w-3.5 text-slate-400" />
                      {r.peso} kg
                    </span>
                  )}
                  {r.observaciones && (
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                      {r.observaciones}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
