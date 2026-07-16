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

import ReceptionistFormDialog from "./ReceptionistFormDialog";

import { Receptionist, ReceptionistRequest } from "@/types/receptionist";
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
  receptionists: Receptionist[];
  onEdit: (id: number, receptionist: ReceptionistRequest) => void;
  onActivate: (id: number) => Promise<void>;
  onDeactivate: (id: number) => Promise<void>;
};

const PAGE_SIZE = 10;

const ReceptionistTable = ({ receptionists, onEdit, onActivate, onDeactivate }: Props) => {
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);
  const [editReceptionist, setEditReceptionist] = useState<Receptionist | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return receptionists;
    const q = search.toLowerCase();
    return receptionists.filter(
      (r) =>
        r.nombres.toLowerCase().includes(q) ||
        r.apellidos.toLowerCase().includes(q) ||
        r.usuario.correo.toLowerCase().includes(q),
    );
  }, [receptionists, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE), [filtered, safePage]);

  const handleConfirm = async () => {
    if (!confirm) return;
    if (confirm.action === "activar") await onActivate(confirm.id);
    else if (confirm.action === "desactivar") await onDeactivate(confirm.id);
    setConfirm(null);
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar searchValue={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar por nombre o correo..." />

      <AnimatedFrame radius={16}>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombres y Apellidos</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((r) => (
              <TableRow key={r.idUsuario} className="group">
                <TableCell className="font-medium">{r.nombres} {r.apellidos}</TableCell>
                <TableCell className="text-muted-foreground">{r.usuario.correo}</TableCell>
                <TableCell className="text-muted-foreground">{r.telefono}</TableCell>
                <TableCell>
                  <Badge variant={r.usuario.habilitado ? "activo" : "inactivo"}>
                    {r.usuario.habilitado ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ContextMenu
                    actions={[
                      { label: "Editar", onClick: () => setEditReceptionist(r) },
                      ...(r.usuario.habilitado
                        ? [{ label: "Desactivar", variant: "destructive" as const, onClick: () => setConfirm({ id: r.idUsuario, nombre: `${r.nombres} ${r.apellidos}`, action: "desactivar" }) }]
                        : [{ label: "Reactivar", onClick: () => setConfirm({ id: r.idUsuario, nombre: `${r.nombres} ${r.apellidos}`, action: "activar" }) }]
                      ),
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-sm text-muted-foreground">
                  {search ? "No se encontraron resultados." : "No hay recepcionistas registrados."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </AnimatedFrame>

      {editReceptionist && (
        <ReceptionistFormDialog mode="edit" buttonColor="alert" data={editReceptionist} open={true} onOpenChange={(v) => { if (!v) setEditReceptionist(null); }} onSubmit={(payload) => { onEdit(editReceptionist.idUsuario, payload); setEditReceptionist(null); }} />
      )}

      <DataTablePagination currentPage={safePage} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <Dialog open={!!confirm} onOpenChange={(v) => { if (!v) setConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="sr-only" />
          <DialogDescription className="sr-only" />
          <div className="py-4 text-center">
            <p className="text-base font-semibold">{confirm?.action === "activar" ? "Reactivar recepcionista" : "Desactivar recepcionista"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{confirm?.action === "activar" ? `¿Reactivar a "${confirm?.nombre}"?` : `¿Desactivar a "${confirm?.nombre}"?`}</p>
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

export default React.memo(ReceptionistTable);
