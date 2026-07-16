"use client";

import React, { useMemo, useState } from "react";
import { SquarePen } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { ClienteResponse } from "@/types/cliente";
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
  owners: ClienteResponse[];
  basePath?: string;
  onActivate: (id: number) => Promise<void>;
  onDeactivate: (id: number) => Promise<void>;
};

const PAGE_SIZE = 10;

const ClientTable = ({ owners, basePath = "/admin/clientes", onActivate, onDeactivate }: Props) => {
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return owners;
    const q = search.toLowerCase();
    return owners.filter(
      (o) =>
        o.nombres.toLowerCase().includes(q) ||
        o.apellidos.toLowerCase().includes(q) ||
        o.dni.toLowerCase().includes(q) ||
        o.usuario.correo.toLowerCase().includes(q),
    );
  }, [owners, search]);

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
      <DataTableToolbar
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        placeholder="Buscar por nombre, DNI o correo..."
      />

      <AnimatedFrame radius={16}>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DNI</TableHead>
              <TableHead>Nombres</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((owner) => (
              <TableRow key={owner.idUsuario} className="group">
                <TableCell className="font-mono text-xs">{owner.dni}</TableCell>
                <TableCell className="font-medium">{owner.nombres}</TableCell>
                <TableCell>{owner.apellidos}</TableCell>
                <TableCell className="text-muted-foreground">{owner.usuario.correo}</TableCell>
                <TableCell className="text-muted-foreground">{owner.telefono}</TableCell>
                <TableCell>
                  <Badge variant={owner.usuario.habilitado ? "activo" : "inactivo"}>
                    {owner.usuario.habilitado ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ContextMenu
                    actions={[
                      {
                        label: "Ver perfil",
                        icon: <SquarePen className="h-3.5 w-3.5" />,
                        onClick: () => window.location.href = `${basePath}/${owner.idUsuario}`,
                      },
                      ...(owner.usuario.habilitado
                        ? [{ label: "Desactivar", variant: "destructive" as const, onClick: () => setConfirm({ id: owner.idUsuario, nombre: `${owner.nombres} ${owner.apellidos}`, action: "desactivar" }) }]
                        : [{ label: "Reactivar", onClick: () => setConfirm({ id: owner.idUsuario, nombre: `${owner.nombres} ${owner.apellidos}`, action: "activar" }) }]
                      ),
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                  {search ? "No se encontraron resultados." : "No hay clientes registrados."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </AnimatedFrame>

      <DataTablePagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <Dialog open={!!confirm} onOpenChange={(v) => { if (!v) setConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="sr-only" />
          <DialogDescription className="sr-only" />
          <div className="py-4 text-center">
            <p className="text-base font-semibold text-foreground">
              {confirm?.action === "activar" ? "Reactivar cliente" : "Desactivar cliente"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {confirm?.action === "activar"
                ? `¿Reactivar a "${confirm?.nombre}"?`
                : `¿Desactivar a "${confirm?.nombre}"?`}
            </p>
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

export default React.memo(ClientTable);
