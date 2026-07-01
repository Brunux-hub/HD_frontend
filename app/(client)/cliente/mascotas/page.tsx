import Link from "next/link";
import { Syringe, Mars, Venus, PawPrint } from "lucide-react";

import { getMascotas, edadEnAnios } from "@/lib/cliente/data";

export default function MisMascotas() {
  const mascotas = getMascotas();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mis mascotas</h1>
        <p className="mt-1 text-sm text-slate-500">
          Aquí verás tus mascotas y el detalle de sus vacunas.
        </p>
      </div>

      {mascotas.length === 0 ? (
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
          {mascotas.map((m) => {
            const pendientes = m.vacunas.filter((v) => v.estado !== "Aplicada").length;
            return (
              <div
                key={m.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative h-40">
                  <img src={m.foto} alt={m.nombre} className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur dark:bg-slate-900/90 dark:text-slate-200">
                    {m.sexo === "FEMALE" ? (
                      <Venus className="h-3.5 w-3.5 text-pink-500" />
                    ) : (
                      <Mars className="h-3.5 w-3.5 text-blue-500" />
                    )}
                    {m.sexo === "FEMALE" ? "Hembra" : "Macho"}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{m.nombre}</h3>
                  <p className="text-sm text-slate-500">
                    {m.especie} · {m.raza}
                  </p>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-slate-400">Edad</dt>
                      <dd className="font-medium text-slate-700 dark:text-slate-200">
                        {edadEnAnios(m.nacimiento)} años
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">Peso</dt>
                      <dd className="font-medium text-slate-700 dark:text-slate-200">{m.peso}</dd>
                    </div>
                  </dl>

                  <Link
                    href={`/cliente/mascotas/${m.id}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
                  >
                    <Syringe className="h-4 w-4" />
                    Ver vacunas
                    {pendientes > 0 && (
                      <span className="ml-1 rounded-full bg-white/25 px-2 text-xs">{pendientes}</span>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
