"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mars, Venus, PawPrint } from "lucide-react";

import { getClientData, edadEnAnios, type Mascota } from "@/lib/cliente/data";
import PetAvatar from "../../_components/PetAvatar";

export default function MisMascotas() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClientData()
      .then(({ mascotas }) => setMascotas(mascotas))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mis mascotas</h1>
        <p className="mt-1 text-sm text-slate-500">
          Aquí verás tus mascotas registradas.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : mascotas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">
            <PawPrint className="h-8 w-8" />
          </span>
          <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
            Aún no tienes mascotas registradas
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Cuando registremos a tu mascota, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mascotas.map((m) => (
            <Link
              key={m.id}
              href={`/cliente/mascotas/${m.id}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-4 p-5">
                <PetAvatar name={m.nombre} className="h-16 w-16 text-2xl" />
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{m.nombre}</h3>
                  <p className="text-sm text-slate-500">{m.especie} · {m.raza}</p>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                    {m.sexo === "HEMBRA" ? (
                      <Venus className="h-3.5 w-3.5 text-pink-500" />
                    ) : (
                      <Mars className="h-3.5 w-3.5 text-blue-500" />
                    )}
                    {m.sexo === "HEMBRA" ? "Hembra" : "Macho"}
                  </span>
                </div>
              </div>

              <div className="px-5 pb-5">
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-slate-400">Edad</dt>
                    <dd className="font-medium text-slate-700 dark:text-slate-200">
                      {edadEnAnios(m.nacimiento)} años
                    </dd>
                  </div>
                </dl>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
