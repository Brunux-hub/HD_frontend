'use client'

import Image, { type StaticImageData } from "next/image";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CircleUserRound,
  ReceiptText,
  BookUser,
  Calendar,
  PawPrint,
} from "lucide-react";

/* --------------------------------------------------------------------------
   Paleta de acentos por vista.
   Cada pantalla recibe su propio color para que no se vean planas ni iguales.
   El morado se reserva para la pantalla de inicio (Panel de control).
---------------------------------------------------------------------------*/
type Accent =
  | "teal"
  | "sky"
  | "blue"
  | "indigo"
  | "cyan"
  | "rose"
  | "amber"
  | "emerald"
  | "orange"
  | "pink"
  | "green";

const ACCENTS: Record<
  Accent,
  { surface: string; ring: string; bar: string; chip: string; shadow: string }
> = {
  teal: {
    surface: "from-teal-50 via-white to-white dark:from-teal-950/40 dark:via-slate-900 dark:to-slate-900",
    ring: "ring-teal-200/70 dark:ring-teal-900/50",
    bar: "from-teal-400 via-teal-500 to-emerald-500",
    chip: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    shadow: "shadow-teal-500/20",
  },
  sky: {
    surface: "from-sky-50 via-white to-white dark:from-sky-950/40 dark:via-slate-900 dark:to-slate-900",
    ring: "ring-sky-200/70 dark:ring-sky-900/50",
    bar: "from-sky-400 via-sky-500 to-blue-500",
    chip: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    shadow: "shadow-sky-500/20",
  },
  blue: {
    surface: "from-blue-50 via-white to-white dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900",
    ring: "ring-blue-200/70 dark:ring-blue-900/50",
    bar: "from-blue-400 via-blue-500 to-indigo-500",
    chip: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    shadow: "shadow-blue-500/20",
  },
  indigo: {
    surface: "from-indigo-50 via-white to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900",
    ring: "ring-indigo-200/70 dark:ring-indigo-900/50",
    bar: "from-indigo-400 via-indigo-500 to-blue-500",
    chip: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    shadow: "shadow-indigo-500/20",
  },
  cyan: {
    surface: "from-cyan-50 via-white to-white dark:from-cyan-950/40 dark:via-slate-900 dark:to-slate-900",
    ring: "ring-cyan-200/70 dark:ring-cyan-900/50",
    bar: "from-cyan-400 via-cyan-500 to-teal-500",
    chip: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    shadow: "shadow-cyan-500/20",
  },
  rose: {
    surface: "from-rose-50 via-white to-white dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-900",
    ring: "ring-rose-200/70 dark:ring-rose-900/50",
    bar: "from-rose-400 via-rose-500 to-pink-500",
    chip: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    shadow: "shadow-rose-500/20",
  },
  amber: {
    surface: "from-amber-50 via-white to-white dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900",
    ring: "ring-amber-200/70 dark:ring-amber-900/50",
    bar: "from-amber-400 via-amber-500 to-orange-500",
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    shadow: "shadow-amber-500/20",
  },
  emerald: {
    surface: "from-emerald-50 via-white to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900",
    ring: "ring-emerald-200/70 dark:ring-emerald-900/50",
    bar: "from-emerald-400 via-emerald-500 to-teal-500",
    chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    shadow: "shadow-emerald-500/20",
  },
  orange: {
    surface: "from-orange-50 via-white to-white dark:from-orange-950/40 dark:via-slate-900 dark:to-slate-900",
    ring: "ring-orange-200/70 dark:ring-orange-900/50",
    bar: "from-orange-400 via-orange-500 to-amber-500",
    chip: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    shadow: "shadow-orange-500/20",
  },
  pink: {
    surface: "from-pink-50 via-white to-white dark:from-pink-950/40 dark:via-slate-900 dark:to-slate-900",
    ring: "ring-pink-200/70 dark:ring-pink-900/50",
    bar: "from-pink-400 via-pink-500 to-rose-500",
    chip: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    shadow: "shadow-pink-500/20",
  },
  green: {
    surface: "from-green-50 via-white to-white dark:from-green-950/40 dark:via-slate-900 dark:to-slate-900",
    ring: "ring-green-200/70 dark:ring-green-900/50",
    bar: "from-green-400 via-green-500 to-emerald-500",
    chip: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    shadow: "shadow-green-500/20",
  },
};

type SectionHeaderProps = {
  iconName?: string;
  iconLabel?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  /** Color de acento propio de la vista. */
  accent?: Accent;
  /** Foto decorativa opcional (cada imagen se usa en una sola vista). */
  image?: StaticImageData;
  imageAlt?: string;
};

const SectionHeader = ({
  iconName,
  iconLabel,
  title,
  description,
  action,
  accent = "teal",
  image,
  imageAlt = "",
}: SectionHeaderProps) => {
  const a = ACCENTS[accent];

  return (
    <Card
      className={cn(
        "card-lift relative flex-row items-stretch justify-between gap-0 overflow-hidden rounded-3xl border-0 bg-gradient-to-br p-0 shadow-xl ring-1",
        a.surface,
        a.ring,
        a.shadow,
      )}
    >
      {/* Barra superior con degradado del acento */}
      <div className={cn("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", a.bar)} />

      {/* Contenido */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-6 pt-8 sm:p-8 sm:pt-9">
        {iconLabel && (
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
              a.chip,
            )}
          >
            {iconName === "Icono Usuarios" && <CircleUserRound className="h-4 w-4" />}
            {iconName === "Icono Servicios" && <ReceiptText className="h-4 w-4" />}
            {iconName === "Icono Clientes" && <BookUser className="h-4 w-4" />}
            {iconName === "Icono Mascotas" && <PawPrint className="h-4 w-4" />}
            {iconName === "Icono Citas" && <Calendar className="h-4 w-4" />}
            {iconLabel}
          </span>
        )}

        <h1 className="text-inherit text-[clamp(1.7rem,2.8vw,2.7rem)] font-bold leading-tight tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">{description}</p>
        )}

        {action && <div className="mt-3 flex flex-wrap gap-2">{action}</div>}
      </div>

      {/* Foto decorativa (solo en pantallas medianas o más grandes) */}
      {image && (
        <div className="relative hidden w-44 shrink-0 self-stretch sm:block lg:w-64">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="256px"
            className="object-cover"
            priority={false}
          />
          {/* Difuminado hacia el contenido para integrar la foto */}
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      )}
    </Card>
  );
};

export default SectionHeader;
