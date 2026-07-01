"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PawPrint, Syringe, CalendarClock, AlertTriangle, ChevronRight } from "lucide-react";

import { getMascotas, edadEnAnios } from "@/lib/cliente/data";
import { getMyOwner } from "@/services/owners/owners";
import type { Owner } from "@/types/owner";

export default function ClienteHome() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const mascotas = getMascotas();

  useEffect(() => {
    getMyOwner()
      .then(setOwner)
      .catch(() => setOwner(null));
  }, []);

  const vacunas = mascotas.flatMap((m) => m.vacunas);
  const aplicadas = vacunas.filter((v) => v.estado === "Aplicada").length;
  const proximas = vacunas.filter((v) => v.estado === "Próxima").length;
  const vencidas = vacunas.filter((v) => v.estado === "Vencida").length;

  const stats = [
    { label: "Mascotas", value: mascotas.length, icon: PawPrint, color: "text-teal-600 bg-teal-100 dark:bg-teal-900/40 dark:text-teal-300" },
    { label: "Vacunas al día", value: aplicadas, icon: Syringe, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300" },
    { label: "Próximas dosis", value: proximas, icon: CalendarClock, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300" },
    { label: "Vencidas", value: vencidas, icon: AlertTriangle, color: "text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-300" },
  ];

  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-teal-800 p-7 text-white shadow-lg sm:p-9">
        <p className="text-sm text-teal-100">Portal del cliente</p>
        <h1 className="mt-1 text-3xl font-bold">
          Hola{owner ? `, ${owner.names}` : ""} 👋
        </h1>
        <p className="mt-2 max-w-lg text-teal-50/90">
          Aquí puedes revisar a tus mascotas y el estado de sus vacunas.
        </p>
      </div>

      {mascotas.length === 0 ? (
        /* Estado vacío */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">
            <PawPrint className="h-8 w-8" />
          </span>
          <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
            Aún no tienes mascotas registradas
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Cuando registremos a tu mascota (por ejemplo, al generar una cita),
            aparecerá aquí junto con sus vacunas.
          </p>
        </div>
      ) : (
        <>
          {vencidas > 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              Tienes <b>{vencidas}</b> vacuna(s) vencida(s). Revisa tus mascotas y agenda una cita.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tus mascotas</h2>
              <Link href="/cliente/mascotas" className="text-sm font-semibold text-teal-600 hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mascotas.map((m) => (
                <Link
                  key={m.id}
                  href={`/cliente/mascotas/${m.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <img src={m.foto} alt={m.nombre} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 dark:text-white">{m.nombre}</p>
                    <p className="truncate text-sm text-slate-500">
                      {m.especie} · {m.raza} · {edadEnAnios(m.nacimiento)} años
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:text-teal-500" />
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
