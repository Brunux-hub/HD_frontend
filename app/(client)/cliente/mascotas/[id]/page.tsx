"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getClientData, edadEnAnios, type Mascota } from "@/lib/cliente/data";
import PetAvatar from "../../../_components/PetAvatar";

const fmt = (iso: string | null) =>
  iso
    ? new Date(iso.slice(0, 10) + "T00:00:00").toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

export default function MascotaDetalle() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClientData()
      .then(({ mascotas }) => setMascota(mascotas.find((m) => m.id === id) ?? null))
      .catch(() => setMascota(null))
      .finally(() => setLoading(false));
  }, [id]);

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
    </div>
  );
}
