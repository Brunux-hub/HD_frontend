"use client";

import React, { useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import ServiceFormDialog from "./ServiceFormDialog";

import { Service, ServiceRequest } from "@/types/service";
import { AnimatedFrame } from "@/components/ui/animated-frame";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { ContextMenu } from "@/components/ui/context-menu";

type ConfirmAction = {
  id: number;
  nombre: string;
  action: "activar" | "desactivar";
};

type Props = {
  services: Service[];
  onEdit?: (id: number, service: ServiceRequest) => void;
  onActivate?: (id: number) => Promise<void>;
  onDeactivate?: (id: number) => Promise<void>;
};

const PAGE_SIZE = 10;

const ServiceTable = ({ services, onEdit, onActivate, onDeactivate }: Props) => {
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);
  const [editService, setEditService] = useState<Service | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return services;
    const q = search.toLowerCase();
    return services.filter((s) => s.nombre.toLowerCase().includes(q) || s.descripcion.toLowerCase().includes(q));
  }, [services, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE), [filtered, safePage]);

  const handleConfirm = async () => {
    if (!confirm) return;
    if (confirm.action === "activar" && onActivate) await onActivate(confirm.id);
    else if (confirm.action === "desactivar" && onDeactivate) await onDeactivate(confirm.id);
    setConfirm(null);
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar searchValue={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar por nombre..." />

      <AnimatedFrame radius={16}>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Nombre</TableHead>
              <TableHead className="text-left">Descripción</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              {onEdit && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((s) => (
              <TableRow key={s.idServicio} className="group">
                <TableCell className="text-left font-medium">{s.nombre}</TableCell>
                <TableCell className="text-left text-muted-foreground max-w-60 truncate">{s.descripcion}</TableCell>
                <TableCell className="font-mono text-xs">S/ {s.precio.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={s.activo ? "activo" : "inactivo"}>
                    {s.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                {onEdit && (
                  <TableCell>
                     <ContextMenu
                      actions={[
                        { label: "Editar", onClick: () => setEditService(s) },
                        ...(s.activo
                          ? [{ label: "Desactivar", variant: "destructive" as const, onClick: () => setConfirm({ id: s.idServicio, nombre: s.nombre, action: "desactivar" }) }]
                          : [{ label: "Reactivar", onClick: () => setConfirm({ id: s.idServicio, nombre: s.nombre, action: "activar" }) }]
                        ),
                      ]}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={onEdit ? 5 : 4} className="h-32 text-center text-sm text-muted-foreground">
                  {search ? "No se encontraron resultados." : "No hay servicios registrados."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </AnimatedFrame>

      {editService && (
        <ServiceFormDialog mode="edit" buttonColor="alert" data={editService} open={true} onOpenChange={(v) => { if (!v) setEditService(null); }} onSubmit={(payload) => { onEdit?.(editService.idServicio, payload); setEditService(null); }} />
      )}

      <DataTablePagination currentPage={safePage} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <Dialog open={!!confirm} onOpenChange={(v) => { if (!v) setConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="sr-only" />
          <DialogDescription className="sr-only" />
          <div className="py-4 text-center">
            <p className="text-base font-semibold">{confirm?.action === "activar" ? "Reactivar servicio" : "Desactivar servicio"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{confirm?.action === "activar" ? `¿Reactivar "${confirm?.nombre}"?` : `¿Desactivar "${confirm?.nombre}"?`}</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setConfirm(null)}>Cancelar</Button>
            <Button variant={confirm?.action === "activar" ? "default" : "destructive"} onClick={handleConfirm}>
              {confirm?.action === "activar" ? "Sí, reactivar" : "Sí, desactivar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(ServiceTable);
