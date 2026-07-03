"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------------------
   Tabla reutilizable con estilo teal.
   Todas las tablas del sistema usan estos componentes, así que el diseño
   (encabezado teal, filas cebra, esquinas redondeadas, sombra y hover) se
   aplica de forma consistente en todas las vistas sin cambiar cada tabla.
----------------------------------------------------------------------------*/

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-2xl border border-teal-100 bg-card shadow-md ring-1 ring-teal-500/10 dark:border-teal-900/40"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom border-collapse text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "bg-gradient-to-r from-teal-600 to-teal-700 text-white [&_tr]:border-0",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        // Filas cebra + resaltado al pasar el mouse (solo en el cuerpo)
        "[&>tr]:transition-colors [&>tr:nth-child(even)]:bg-teal-50/50 dark:[&>tr:nth-child(even)]:bg-teal-950/15 [&>tr:hover]:bg-teal-100/70 dark:[&>tr:hover]:bg-teal-900/25 [&_tr:last-child]:border-0",
        className
      )}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-teal-100 bg-teal-50/60 font-medium dark:border-teal-900/40 dark:bg-teal-950/20 [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border/40 transition-colors data-[state=selected]:bg-teal-100/60 dark:data-[state=selected]:bg-teal-900/30",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-12 px-4 text-center align-middle text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-white/95 first:rounded-tl-xl last:rounded-tr-xl [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-3 text-center align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 mb-2 text-center text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
