"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookUser,
  PawPrint,
  Calendar,
  Stethoscope,
  ReceiptText,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

import { getOwners } from "@/services/owners/owners";
import { getPets } from "@/services/pets/pets";
import { getAppointments } from "@/services/appointments/appointments";
import { getVeterinarians } from "@/services/veterinarians/veterinarians";
import { getServices } from "@/services/services/services";
import type { Appointment } from "@/types/appointment";
import type { Pet } from "@/types/pet";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { AnimatedFrame } from "@/components/ui/animated-frame";
const COLORS = { PROGRAMADA: "#2a78d6", EN_CURSO: "#eda100", FINALIZADA: "#1baf7a", CANCELADA: "#e34948" };
const STATUS_ORDER = ["PROGRAMADA", "EN_CURSO", "FINALIZADA", "CANCELADA"];
const STATUS_LABELS: Record<string, string> = {
  PROGRAMADA: "Programadas", EN_CURSO: "En curso", FINALIZADA: "Finalizadas", CANCELADA: "Canceladas",
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ owners: 0, pets: 0, appts: 0, vets: 0, services: 0 });
  const [byStatus, setByStatus] = useState<Record<string, number>>({});
  const [bySpecies, setBySpecies] = useState<{ label: string; value: number }[]>([]);
  const [upcoming, setUpcoming] = useState<(Appointment & { _petName?: string; _vetName?: string })[]>([]);

  useEffect(() => {
    const safe = <T,>(p: Promise<T[]>) => p.catch(() => [] as T[]);
    Promise.all([
      safe(getOwners()), safe(getPets()), safe(getAppointments()),
      safe(getVeterinarians()), safe(getServices()),
    ])
      .then(([owners, pets, appts, vets, services]) => {
        setCounts({ owners: owners.length, pets: pets.length, appts: appts.length, vets: vets.length, services: services.length });

        const status: Record<string, number> = {};
        appts.forEach((a) => (status[a.estado] = (status[a.estado] ?? 0) + 1));
        setByStatus(status);

        const species: Record<string, number> = {};
        pets.forEach((p) => (species[p.especie || "Otro"] = (species[p.especie || "Otro"] ?? 0) + 1));
        setBySpecies(Object.entries(species).map(([label, value]) => ({ label, value }))
          .sort((a, b) => b.value - a.value).slice(0, 6));

        const petMap = new Map((pets as Pet[]).map((p) => [p.idMascota, p]));
        const vetMap = new Map((vets as import("@/types/veterinarian").Veterinarian[]).map((v) => [v.idUsuario, v]));
        const now = Date.now();
        setUpcoming([...appts]
          .filter((a) => new Date(a.fechaProgramada).getTime() >= now)
          .sort((a, b) => new Date(a.fechaProgramada).getTime() - new Date(b.fechaProgramada).getTime())
          .slice(0, 5)
          .map((a) => ({ ...a, _petName: petMap.get(a.idMascota)?.nombre, _vetName: `${vetMap.get(a.idUsuarioVeterinario)?.nombres ?? ""} ${vetMap.get(a.idUsuarioVeterinario)?.apellidos ?? ""}` })),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const kpis = useMemo(() => [
    { label: "Clientes", value: counts.owners, icon: BookUser, href: "/admin/clientes" },
    { label: "Mascotas", value: counts.pets, icon: PawPrint, href: "/admin/mascotas" },
    { label: "Citas", value: counts.appts, icon: Calendar, href: "/admin/citas" },
    { label: "Veterinarios", value: counts.vets, icon: Stethoscope, href: "/admin/veterinarios" },
    { label: "Servicios", value: counts.services, icon: ReceiptText, href: "/admin/servicios" },
  ], [counts]);

  const donutData = useMemo(() =>
    STATUS_ORDER.map((s) => ({ name: STATUS_LABELS[s], value: byStatus[s] ?? 0, color: COLORS[s as keyof typeof COLORS] })),
    [byStatus]);

  const fmtDateTime = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso.slice(0, 16));
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4 py-2">
      <div className="hero-teal-ring relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-500">
        <div className="relative p-7 sm:p-9">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/25">
            <PawPrint className="h-4 w-4" /> Panel de control
          </span>
          <h1 className="mt-3 text-3xl font-bold text-white drop-shadow-sm sm:text-4xl">Bienvenido a la clínica</h1>
          <p className="mt-1 max-w-md text-sm text-white! drop-shadow-sm sm:text-base">Resumen general de la clínica en tiempo real.</p>
        </div>
      </div>

      {loading ? (
        <TableSkeleton columns={5} rows={4} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {kpis.map((k) => (
              <AnimatedFrame key={k.label} radius={16}>
                <Link href={k.href}
                  className="block rounded-2xl border border-teal-100 bg-white p-4 dark:border-teal-900/40 dark:bg-slate-900">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                    <k.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{k.value}</p>
                  <p className="text-xs text-slate-500">{k.label}</p>
                </Link>
              </AnimatedFrame>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <AnimatedFrame radius={16}>
              <div className="relative rounded-2xl border border-teal-100 bg-white p-6 h-full dark:border-teal-900/40 dark:bg-slate-900">
                <h2 className="mb-5 font-bold text-slate-900 dark:text-white">Citas por estado</h2>
              {donutData.every((d) => d.value === 0) ? (
                <p className="text-sm text-slate-500">Sin datos.</p>
              ) : (
                <div className="flex flex-col items-center gap-6 sm:flex-row h-full">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={70}
                        dataKey="value" paddingAngle={2}>
                        {donutData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "13px" }}
                        formatter={(value: number, name: string) => [value, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-full space-y-2">
                    {donutData.map((d) => (
                      <div key={d.name} className="flex items-center gap-2 text-sm">
                        <span className="h-3 w-3 rounded-sm" style={{ background: d.color }} />
                        <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                        <span className="ml-auto font-semibold tabular-nums text-slate-900 dark:text-white">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </AnimatedFrame>

            <AnimatedFrame radius={16}>
              <div className="relative rounded-2xl border border-teal-100 bg-white p-6 h-full dark:border-teal-900/40 dark:bg-slate-900">
                <h2 className="mb-5 font-bold text-slate-900 dark:text-white">Mascotas por especie</h2>
              {bySpecies.length === 0 ? (
                <p className="text-sm text-slate-500">Sin datos.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={bySpecies} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="label" width={100} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "13px" }}
                    />
                    <Bar dataKey="value" fill="#0d9488" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              </div>
            </AnimatedFrame>
          </div>

          <AnimatedFrame radius={16}>
            <div className="relative rounded-2xl border border-teal-100 bg-white p-6 dark:border-teal-900/40 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white">Próximas citas</h2>
              <Link href="/admin/citas" className="text-sm font-semibold text-teal-600 hover:underline">Ver todas</Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-slate-500">No hay citas próximas.</p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {upcoming.map((a, idx) => (
                  <li key={`appt-${a.idCita}-${idx}`} className="flex items-center gap-3 py-3 text-sm">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLORS[a.estado as keyof typeof COLORS] ?? "#94a3b8" }} />
                    <span className="font-medium text-slate-900 dark:text-white">{a._petName ?? "—"}</span>
                    <span className="text-slate-500">con {a._vetName || "—"}</span>
                    <span className="ml-auto tabular-nums text-slate-500">{fmtDateTime(a.fechaProgramada)}</span>
                  </li>
                ))}
              </ul>
            )}
            </div>
          </AnimatedFrame>
        </>
      )}
    </div>
  );
}
