import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Convierte ISO "2024-01-15T10:30:00" a "15/01/2024" */
export const fmtDate = (iso?: string) =>
  iso ? new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso)) : "—";

/** Convierte ISO "2024-01-15T10:30:00" a "15/01/2024 10:30" */
export const fmtDateTime = (iso?: string) =>
  iso
    ? new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(iso))
    : "—";
