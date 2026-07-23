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

import { User } from "@/types/user";
import { AnimatedFrame } from "@/components/ui/animated-frame";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { ContextMenu } from "@/components/ui/context-menu";

type ConfirmAction = {
  id: number;
  correo: string;
  action: "activar" | "desactivar";
};

type Props = {
  users: User[];
  onActivate: (id: number) => Promise<void>;
  onDeactivate: (id: number) => Promise<void>;
  onChangePassword: (user: User) => void;
};

const PAGE_SIZE = 10;

const UserTable = ({ users, onActivate, onDeactivate, onChangePassword }: Props) => {
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter((u) => u.correo.toLowerCase().includes(q) || u.rol.toLowerCase().includes(q));
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE), [filtered, safePage]);

  const handleConfirm = async () => {
    if (!confirm) return;
    if (confirm.action === "activar") await onActivate(confirm.id);
    else if (confirm.action === "desactivar") await onDeactivate(confirm.id);
    setConfirm(null);
  };

  const roleBadge = (rol: string) => {
    const variant = rol === "ADMIN" ? "PROGRAMADA" : "default";
    return <Badge variant={variant}>{rol}</Badge>;
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar searchValue={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar por correo o rol..." />

      <AnimatedFrame radius={16}>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((user) => (
              <TableRow key={user.idUsuario} className="group">
                <TableCell className="font-medium">{user.correo}</TableCell>
                <TableCell>{roleBadge(user.rol)}</TableCell>
                <TableCell>
                  <Badge variant={user.habilitado ? "activo" : "inactivo"}>
                    {user.habilitado ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ContextMenu
                    actions={[
                      { label: "Cambiar Contraseña", onClick: () => onChangePassword(user) },
                      ...(user.habilitado
                        ? [{ label: "Desactivar", variant: "destructive" as const, onClick: () => setConfirm({ id: user.idUsuario, correo: user.correo, action: "desactivar" }) }]
                        : [{ label: "Reactivar", onClick: () => setConfirm({ id: user.idUsuario, correo: user.correo, action: "activar" }) }]
                      ),
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-sm text-muted-foreground">
                  {search ? "No se encontraron resultados." : "No hay usuarios registrados."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </AnimatedFrame>

      <DataTablePagination currentPage={safePage} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <Dialog open={!!confirm} onOpenChange={(v) => { if (!v) setConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="sr-only" />
          <DialogDescription className="sr-only" />
          <div className="py-4 text-center">
            <p className="text-base font-semibold">{confirm?.action === "activar" ? "Reactivar usuario" : "Desactivar usuario"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{confirm?.action === "activar" ? `¿Reactivar a "${confirm?.correo}"?` : `¿Desactivar a "${confirm?.correo}"?`}</p>
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

export default React.memo(UserTable);
