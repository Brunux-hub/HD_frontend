"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PawPrint, ChevronRight } from "lucide-react";

import { getClientData, edadEnAnios, type Mascota } from "@/lib/cliente/data";
import PetAvatar from "../_components/PetAvatar";
import type { Owner } from "@/types/owner";

export default function ClienteHome() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClientData()
      .then(({ owner, mascotas }) => {
        setOwner(owner);
        setMascotas(mascotas);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Mascotas", value: mascotas.length, icon: PawPrint, color: "text-teal-600 bg-teal-100 dark:bg-teal-900/40 dark:text-teal-300" },
  ];

  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-teal-800 p-7 text-white shadow-lg sm:p-9">
        <p className="text-sm text-teal-100">Portal del cliente</p>
        <h1 className="mt-1 text-3xl font-bold">Hola{owner ? `, ${owner.names}` : ""} 👋</h1>
        <p className="mt-2 max-w-lg text-teal-50/90">
          Aquí puedes revisar a tus mascotas.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando tu información...</p>
      ) : mascotas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">
            <PawPrint className="h-8 w-8" />
          </span>
          <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
            Aún no tienes mascotas registradas
          </h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Cuando registremos a tu mascota (por ejemplo, al generar una cita),
          aparecerá aquí.
        </p>
        </div>
      ) : (
        <>
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
                  <PetAvatar name={m.nombre} className="h-16 w-16 text-xl" />
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
