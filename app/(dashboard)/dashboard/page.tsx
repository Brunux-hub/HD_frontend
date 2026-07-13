"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookUser,
  PawPrint,
  Calendar,
  Stethoscope,
  ReceiptText,
} from "lucide-react";

import { getOwners } from "@/services/owners/owners";
import { getPets } from "@/services/pets/pets";
import { getAppointments } from "@/services/appointments/appointments";
import { getVeterinarians } from "@/services/veterinarians/veterinarians";
import { getServices } from "@/services/services/services";
import type { Appointment } from "@/types/appointment";

// Estados de cita: colores categóricos validados (CVD ΔE 21.2) — con etiqueta directa.
const STATUS_META: Record<Appointment["status"], { label: string; color: string }> = {
  OPENED: { label: "Abiertas", color: "#2a78d6" },
  CLOSED: { label: "Cerradas", color: "#1baf7a" },
  CANCELED: { label: "Canceladas", color: "#e34948" },
  RESCHEDULED: { label: "Reprogramadas", color: "#eda100" },
};
const STATUS_ORDER: Appointment["status"][] = ["OPENED", "CLOSED", "CANCELED", "RESCHEDULED"];

const SPECIES_COLOR = "#0d9488"; // teal-600 (una sola serie de magnitud)

// -------- Gráficas ligeras (SVG/CSS, sin dependencias) --------
function Donut({ data, total }: { data: { label: string; value: number; color: string }[]; total: number }) {
  const R = 56;
  const C = 2 * Math.PI * R;
  const safeTotal = total || 1;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 140 140" className="h-40 w-40">
          <g transform="rotate(-90 70 70)">
            <circle cx="70" cy="70" r={R} fill="none" strokeWidth="18" className="stroke-slate-100 dark:stroke-slate-800" />
            {data.map((d) => {
              const len = (d.value / safeTotal) * C;
              const seg = (
                <circle
                  key={d.label}
                  cx="70"
                  cy="70"
                  r={R}
                  fill="none"
                  stroke={d.color}
                  strokeWidth="18"
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return seg;
            })}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{total}</span>
          <span className="text-xs text-slate-500">citas</span>
        </div>
      </div>
      <div className="w-full space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ background: d.color }} />
            <span className="text-slate-600 dark:text-slate-300">{d.label}</span>
            <span className="ml-auto font-semibold tabular-nums text-slate-900 dark:text-white">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarList({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  if (data.length === 0) {
    return <p className="text-sm text-slate-500">Sin datos.</p>;
  }
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="text-sm">
          <div className="mb-1 flex justify-between">
            <span className="text-slate-600 dark:text-slate-300">{d.label}</span>
            <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{d.value}</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full" style={{ width: `${(d.value / max) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Borde teal (color del sidebar) que se dibuja alrededor de la tarjeta al pasar el mouse.
function AnimatedBorder() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <rect
        className="ab-rect"
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx="18"
        ry="18"
        fill="none"
        stroke="#0f766e"
        strokeWidth="2"
        pathLength={100}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// -------- Página --------
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ owners: 0, pets: 0, appts: 0, vets: 0, services: 0 });
  const [byStatus, setByStatus] = useState<Record<string, number>>({});
  const [bySpecies, setBySpecies] = useState<{ label: string; value: number }[]>([]);
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);

  useEffect(() => {
    const safe = <T,>(p: Promise<T[]>) => p.catch(() => [] as T[]);
    Promise.all([
      safe(getOwners()),
      safe(getPets()),
      safe(getAppointments()),
      safe(getVeterinarians()),
      safe(getServices()),
    ])
      .then(([owners, pets, appts, vets, services]) => {
        setCounts({
          owners: owners.length,
          pets: pets.length,
          appts: appts.length,
          vets: vets.length,
          services: services.length,
        });

        const status: Record<string, number> = {};
        appts.forEach((a) => (status[a.status] = (status[a.status] ?? 0) + 1));
        setByStatus(status);

        const species: Record<string, number> = {};
        pets.forEach((p) => (species[p.species || "Otro"] = (species[p.species || "Otro"] ?? 0) + 1));
        setBySpecies(
          Object.entries(species)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6),
        );

        const now = Date.now();
        setUpcoming(
          [...appts]
            .filter((a) => new Date(a.date).getTime() >= now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    { label: "Clientes", value: counts.owners, icon: BookUser, href: "/dashboard/clientes" },
    { label: "Mascotas", value: counts.pets, icon: PawPrint, href: "/dashboard/mascotas" },
    { label: "Citas", value: counts.appts, icon: Calendar, href: "/dashboard/citas" },
    { label: "Veterinarios", value: counts.vets, icon: Stethoscope, href: "/dashboard/veterinarios" },
    { label: "Servicios", value: counts.services, icon: ReceiptText, href: "/dashboard/servicios" },
  ];

  const donutData = STATUS_ORDER.map((s) => ({
    label: STATUS_META[s].label,
    value: byStatus[s] ?? 0,
    color: STATUS_META[s].color,
  }));

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4 py-2">
      {/* Hero con shadowbox degradado teal (color del sidebar) */}
      <div className="hero-teal-ring relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-500">
        <div className="relative p-7 sm:p-9">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/25">
            <PawPrint className="h-4 w-4" /> Panel de control
          </span>
          <h1 className="mt-3 text-3xl font-bold text-white drop-shadow-sm sm:text-4xl">
            Bienvenido a la clínica
          </h1>
          <p className="mt-1 max-w-md text-sm text-white! drop-shadow-sm sm:text-base">
            Resumen general de la clínica en tiempo real.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando indicadores...</p>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {kpis.map((k) => (
              <Link
                key={k.label}
                href={k.href}
                className="hovercard relative rounded-2xl border border-teal-100 bg-white p-4 dark:border-teal-900/40 dark:bg-slate-900"
              >
                <AnimatedBorder />
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  <k.icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{k.value}</p>
                <p className="text-xs text-slate-500">{k.label}</p>
              </Link>
            ))}
          </div>

          {/* Gráficas */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="hovercard relative rounded-2xl border border-teal-100 bg-white p-6 dark:border-teal-900/40 dark:bg-slate-900">
              <AnimatedBorder />
              <h2 className="mb-5 font-bold text-slate-900 dark:text-white">Citas por estado</h2>
              <Donut data={donutData} total={counts.appts} />
            </div>

            <div className="hovercard relative rounded-2xl border border-teal-100 bg-white p-6 dark:border-teal-900/40 dark:bg-slate-900">
              <AnimatedBorder />
              <h2 className="mb-5 font-bold text-slate-900 dark:text-white">Mascotas por especie</h2>
              <BarList data={bySpecies} color={SPECIES_COLOR} />
            </div>
          </div>

          {/* Próximas citas */}
          <div className="hovercard relative rounded-2xl border border-teal-100 bg-white p-6 dark:border-teal-900/40 dark:bg-slate-900">
            <AnimatedBorder />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white">Próximas citas</h2>
              <Link href="/dashboard/citas" className="text-sm font-semibold text-teal-600 hover:underline">
                Ver todas
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-slate-500">No hay citas próximas.</p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {upcoming.map((a, idx) => (
                  <li key={`appt-${a.id_appointment}-${idx}`} className="flex items-center gap-3 py-3 text-sm">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: STATUS_META[a.status]?.color ?? "#94a3b8" }} />
                    <span className="font-medium text-slate-900 dark:text-white">{a.pet?.name ?? "—"}</span>
                    <span className="text-slate-500">
                      con {a.veterinarian?.names} {a.veterinarian?.last_names}
                    </span>
                    <span className="ml-auto tabular-nums text-slate-500">
                      {a.date?.slice(0, 16).replace("T", " ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
