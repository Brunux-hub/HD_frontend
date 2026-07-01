"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Syringe, CalendarDays, Stethoscope, Building2 } from "lucide-react";

import { getMascotaById, edadEnAnios, type Vacuna } from "@/lib/cliente/data";

const estadoStyles: Record<Vacuna["estado"], string> = {
  Aplicada: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Próxima: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Vencida: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const fmt = (iso: string | null) =>
  iso
    ? new Date(iso + "T00:00:00").toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function MascotaDetalle() {
  const params = useParams<{ id: string }>();
  const mascota = getMascotaById(Number(params.id));

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

      {/* Cabecera de la mascota */}
      <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <img src={mascota.foto} alt={mascota.nombre} className="h-28 w-28 rounded-2xl object-cover" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{mascota.nombre}</h1>
          <p className="text-sm text-slate-500">
            {mascota.especie} · {mascota.raza} · {mascota.sexo === "FEMALE" ? "Hembra" : "Macho"}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400">Edad</p>
              <p className="font-medium text-slate-700 dark:text-slate-200">{edadEnAnios(mascota.nacimiento)} años</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Peso</p>
              <p className="font-medium text-slate-700 dark:text-slate-200">{mascota.peso}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Nacimiento</p>
              <p className="font-medium text-slate-700 dark:text-slate-200">{fmt(mascota.nacimiento)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vacunas */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Syringe className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Vacunas de {mascota.nombre}
          </h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {mascota.vacunas.length}
          </span>
        </div>

        {mascota.vacunas.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            Esta mascota aún no tiene vacunas registradas.
          </div>
        ) : (
          <div className="space-y-3">
            {mascota.vacunas.map((v) => (
              <div
                key={v.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{v.nombre}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${estadoStyles[v.estado]}`}>
                      {v.estado}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <Building2 className="h-3.5 w-3.5" /> {v.fabricante}
                    <span className="mx-1">·</span>
                    <Stethoscope className="h-3.5 w-3.5" /> {v.veterinario}
                  </p>
                </div>

                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" /> Aplicada
                    </p>
                    <p className="font-medium text-slate-700 dark:text-slate-200">{fmt(v.fechaAplicacion)}</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" /> Próxima
                    </p>
                    <p className="font-medium text-slate-700 dark:text-slate-200">{fmt(v.proximaDosis)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
