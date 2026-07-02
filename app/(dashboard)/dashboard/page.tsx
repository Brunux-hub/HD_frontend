
"use client";

import {
  Activity,
  CalendarClock,
  Dog,
  Calendar,
  Info,
  PawPrint,
  ShieldPlus,
  UserRound,
} from "lucide-react";
import { type ComponentType, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { findAllAppointments } from "@/services/citas/appointmentService";
import { findAllPets } from "@/services/mascotas/petService";
import { getOwners } from "@/services/owners/owners";
import { findAllReceptionists } from "@/services/recepcionistas/receptionistService";
import { findAllVeterinarians } from "@/services/veterinarios/veterinarianService";
import type { AppointmentItem } from "@/types/cita";
import { APPOINTMENT_STATUSES, type AppointmentStatus } from "@/types/enums";
import type { Owner } from "@/types/owner";
import type { PetItem } from "@/types/mascota";
import type { ReceptionistItem } from "@/types/recepcionista";
import type { VeterinarianItem } from "@/types/veterinario";

type DashboardKpi = {
  title: string;
  value: number;
  description: string;
  icon: ComponentType<{ className?: string }>;
  hoverTitle?: string;
  hoverItems?: Array<{ label: string; value: string | number }>;
};

type AppointmentsByDayPoint = {
  date: string;
  total: number;
};

type AppointmentStatusPoint = {
  status: string;
  total: number;
  fill: string;
};

type PetsBySpeciesPoint = {
  species: string;
  total: number;
  fill: string;
};

type DashboardData = {
  appointments: AppointmentItem[];
  pets: PetItem[];
  owners: Owner[];
  veterinarians: VeterinarianItem[];
  receptionists: ReceptionistItem[];
};

const STATUS_LABELS: Record<string, string> = {
  OPENED: "Abiertas",
  CLOSED: "Cerradas",
  CANCELED: "Canceladas",
  RESCHEDULED: "Reprogramadas",
};

const STATUS_COLORS: Record<string, string> = {
  OPENED: "var(--chart-1)",
  CLOSED: "var(--chart-2)",
  CANCELED: "var(--chart-4)",
  RESCHEDULED: "var(--chart-5)",
};

const SPECIES_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const areaChartConfig = {
  total: {
    label: "Citas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const statusChartConfig = {
  total: {
    label: "Citas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const speciesChartConfig = {
  total: {
    label: "Mascotas",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const EMPTY_APPOINTMENTS: AppointmentItem[] = [];
const EMPTY_PETS: PetItem[] = [];
const EMPTY_OWNERS: Owner[] = [];
const EMPTY_VETERINARIANS: VeterinarianItem[] = [];
const EMPTY_RECEPTIONISTS: ReceptionistItem[] = [];

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}

function normalizeSpecies(species: string | null | undefined) {
  const value = species?.trim();
  return value ? value : "Sin especie";
}

function buildAppointmentsByDay(appointments: AppointmentItem[]): AppointmentsByDayPoint[] {
  const byDay = appointments.reduce<Record<string, number>>((acc, appointment) => {
    const dayKey = new Date(appointment.date).toLocaleDateString("sv-SE");
    acc[dayKey] = (acc[dayKey] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(byDay)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(-7)
    .map(([date, total]) => ({
      date,
      total,
    }));
}

function buildAppointmentsByStatus(
  appointments: AppointmentItem[],
): AppointmentStatusPoint[] {
  const counts = appointments.reduce<Record<string, number>>((acc, appointment) => {
    const status = appointment.status;
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});

  const knownStatuses = APPOINTMENT_STATUSES.filter((status) => counts[status] > 0).map(
    (status) => ({
      status: STATUS_LABELS[status] ?? status,
      total: counts[status],
      fill: STATUS_COLORS[status] ?? "var(--chart-3)",
    }),
  );

  const customStatuses = Object.entries(counts)
    .filter(([status]) => !APPOINTMENT_STATUSES.includes(status as AppointmentStatus))
    .map(([status, total], index) => ({
      status,
      total,
      fill: SPECIES_COLORS[index % SPECIES_COLORS.length],
    }));

  return [...knownStatuses, ...customStatuses];
}

function buildPetsBySpecies(pets: PetItem[]): PetsBySpeciesPoint[] {
  const counts = pets.reduce<Record<string, number>>((acc, pet) => {
    const species = normalizeSpecies(pet.species);
    acc[species] = (acc[species] ?? 0) + 1;
    return acc;
  }, {});

  const ordered = Object.entries(counts)
    .sort(([, totalA], [, totalB]) => totalB - totalA)
    .map(([species, total]) => ({ species, total }));

  const topSpecies = ordered.slice(0, 5);
  const remainingTotal = ordered.slice(5).reduce((sum, item) => sum + item.total, 0);

  const result = topSpecies.map((item, index) => ({
    ...item,
    fill: SPECIES_COLORS[index % SPECIES_COLORS.length],
  }));

  if (remainingTotal > 0) {
    result.push({
      species: "Otras",
      total: remainingTotal,
      fill: "var(--chart-5)",
    });
  }

  return result;
}

function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          appointments,
          pets,
          owners,
          veterinarians,
          receptionists,
        ] = await Promise.all([
          findAllAppointments(),
          findAllPets(),
          getOwners(),
          findAllVeterinarians(),
          findAllReceptionists(),
        ]);

        setData({
          appointments,
          pets,
          owners,
          veterinarians,
          receptionists,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar la información principal del dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const appointments = data?.appointments ?? EMPTY_APPOINTMENTS;
  const pets = data?.pets ?? EMPTY_PETS;
  const owners = data?.owners ?? EMPTY_OWNERS;
  const veterinarians = data?.veterinarians ?? EMPTY_VETERINARIANS;
  const receptionists = data?.receptionists ?? EMPTY_RECEPTIONISTS;

  const appointmentsByDay = useMemo(
    () => buildAppointmentsByDay(appointments),
    [appointments],
  );
  const appointmentsByStatus = useMemo(
    () => buildAppointmentsByStatus(appointments),
    [appointments],
  );
  const petsBySpecies = useMemo(() => buildPetsBySpecies(pets), [pets]);

  const openAppointments = appointments.filter(
    (appointment) => appointment.status === "OPENED",
  ).length;

  const kpis: DashboardKpi[] = [
    {
      title: "Mascotas registradas",
      value: pets.length,
      description: "Pacientes activos en el sistema",
      icon: PawPrint,
      hoverTitle: "especies registradas",
      hoverItems: petsBySpecies.slice(0, 5).map((item) => ({
        label: item.species,
        value: item.total,
      })),
    },
    {
      title: "Dueños registrados",
      value: owners.length,
      description: "Clientes con ficha vigente",
      icon: UserRound,
    },
    {
      title: "Citas totales",
      value: appointments.length,
      description: "Historial completo de atenciones",
      icon: Calendar,
    },
    {
      title: "Citas abiertas",
      value: openAppointments,
      description: "Pendientes de cierre clínico",
      icon: CalendarClock,
      hoverTitle: "Distribución por estado",
      hoverItems: appointmentsByStatus.map((item) => ({
        label: item.status,
        value: item.total,
      })),
    },
  ];

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <Card className="rounded-b-4xl px-6 py-7">
        <CardHeader className="px-0">
          <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-sm text-muted-foreground">
            <ShieldPlus className="size-4" />
            Dashboard
          </div>
          <CardTitle className="text-[clamp(1.9rem,3vw,3.4rem)] font-normal tracking-tight">
            Panel de resumen Healthy Pets
          </CardTitle>
        </CardHeader>
      </Card>

      {error ? (
        <Card className="border border-destructive/30 bg-destructive/5">
          <CardContent className="py-6">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={`dashboard-kpi-skeleton-${index}`} className="min-h-40">
                <CardHeader>
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-9 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-36" />
                </CardContent>
              </Card>
            ))
          : kpis.map((kpi) => {
              const Icon = kpi.icon;

              return (
                <Card
                  key={kpi.title}
                  className="min-h-40 border border-border/60 bg-card/95"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardDescription>{kpi.title}</CardDescription>
                        <CardTitle className="text-4xl font-normal tracking-tight">
                          {kpi.value}
                        </CardTitle>
                      </div>
                      <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                        <Icon className="size-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-end justify-between gap-4">
                    <p className="text-sm text-muted-foreground">{kpi.description}</p>
                    {kpi.hoverTitle && kpi.hoverItems?.length ? (
                      <HoverCard openDelay={150} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Info className="size-3.5" />
                            Detalle
                          </button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64">
                          <div className="space-y-3">
                            <p className="text-sm font-medium">{kpi.hoverTitle}</p>
                            <div className="space-y-2">
                              {kpi.hoverItems.map((item) => (
                                <div
                                  key={`${kpi.title}-${item.label}`}
                                  className="flex items-center justify-between gap-3 text-sm"
                                >
                                  <span className="text-muted-foreground">
                                    {item.label}
                                  </span>
                                  <span className="font-medium">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
      </section>

      <section className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground" />
              Evolución de citas
            </CardTitle>
            <CardDescription>
              Últimos 7 días con registros agrupados por fecha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[320px] w-full rounded-xl" />
            ) : appointmentsByDay.length ? (
              <ChartContainer
                config={areaChartConfig}
                className="h-[320px] w-full"
              >
                <AreaChart data={appointmentsByDay} margin={{ left: 4, right: 4 }}>
                  <defs>
                    <linearGradient id="appointmentsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                    tickFormatter={formatDateLabel}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent labelFormatter={(label) => formatDateLabel(String(label))} />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="var(--color-total)"
                    fill="url(#appointmentsFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <EmptyState
                title="Sin citas para graficar"
                description="Cuando existan citas registradas, aquí verás su evolución diaria."
              />
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="size-4 text-muted-foreground" />
              Estados de citas
            </CardTitle>
            <CardDescription>
              Distribución actual del flujo de atención.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[320px] w-full rounded-xl" />
            ) : appointmentsByStatus.length ? (
              <ChartContainer
                config={statusChartConfig}
                className="h-[320px] w-full"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={appointmentsByStatus}
                    dataKey="total"
                    nameKey="status"
                    innerRadius={75}
                    outerRadius={108}
                    paddingAngle={3}
                  >
                    {appointmentsByStatus.map((entry) => (
                      <Cell key={`status-${entry.status}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <EmptyState
                title="Sin estados disponibles"
                description="Todavía no hay citas con estado para mostrar en el resumen."
              />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dog className="size-4 text-muted-foreground" />
              Mascotas por especie
            </CardTitle>
            <CardDescription>
              Especies registradas en la veterinaria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[280px] w-full rounded-xl" />
            ) : petsBySpecies.length ? (
              <ChartContainer
                config={speciesChartConfig}
                className="h-[280px] w-full"
              >
                <BarChart data={petsBySpecies} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="species"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" radius={10}>
                    {petsBySpecies.map((entry) => (
                      <Cell key={`species-${entry.species}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <EmptyState
                title="Sin especies registradas"
                description="Aún no hay mascotas cargadas para armar la distribución."
              />
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldPlus className="size-4 text-muted-foreground" />
              Capacidad operativa
            </CardTitle>
            <CardDescription>
              Resumen rápido del equipo clínico y administrativo.
            </CardDescription>
            <CardAction>
              <div className="rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
                Actualizado
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            <OperationalStat
              label="Veterinarios Disponibles"
              value={veterinarians.length}
              hint=""
            />
            <OperationalStat
              label="Recepcionistas"
              value={receptionists.length}
              hint=""
            />
            <OperationalStat
              label="Promedio de citas por mascota"
              value={
                pets.length
                  ? Number((appointments.length / pets.length).toFixed(1))
                  : 0
              }
              hint=""
            />
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="mb-2 text-sm font-medium">Resumen</p>
              <p className="text-sm text-muted-foreground">
                {appointments.length
                  ? `Actualmente hay ${openAppointments} cita(s) abierta(s) y ${pets.length} mascota(s) registradas en el sistema.`
                  : "Todavía no existen citas registradas. El dashboard se completará automáticamente cuando ingresen datos."}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/10 px-6 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function OperationalStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-normal tracking-tight">{value}</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export default DashboardPage;
