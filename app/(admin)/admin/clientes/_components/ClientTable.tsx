"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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

const ClientTable = ({ owners, basePath = "/admin/clientes", onActivate, onDeactivate }: Props) => {
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);

  const handleConfirm = async () => {
    if (!confirm) return;
    if (confirm.action === "activar") await onActivate(confirm.id);
    else if (confirm.action === "desactivar") await onDeactivate(confirm.id);
    setConfirm(null);
  };

  const msgs: Record<ConfirmAction["action"], { title: string; desc: string }> = {
    activar: {
      title: "Reactivar cliente",
      desc: `¿Estás seguro de reactivar a "${confirm?.nombre}"?`,
    },
    desactivar: {
      title: "Desactivar cliente",
      desc: `¿Estás seguro de desactivar a "${confirm?.nombre}"?`,
    },

  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>DNI</TableHead>
            <TableHead>Nombres</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead className="w-25"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {owners.map((owner) => (
            <TableRow key={owner.idUsuario}>
              <TableCell>
                <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${owner.usuario.habilitado ? "bg-green-500" : "bg-red-500"}`} />
                {owner.dni}
              </TableCell>
              <TableCell>{owner.nombres}</TableCell>
              <TableCell>{owner.apellidos}</TableCell>
              <TableCell>{owner.usuario.correo}</TableCell>
              <TableCell>{owner.telefono}</TableCell>
              <TableCell>{owner.direccion}</TableCell>
              <TableCell className="flex gap-2">
                {owner.usuario.habilitado ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirm({ id: owner.idUsuario, nombre: `${owner.nombres} ${owner.apellidos}`, action: "desactivar" })}
                  >
                    Desactivar
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirm({ id: owner.idUsuario, nombre: `${owner.nombres} ${owner.apellidos}`, action: "activar" })}
                  >
                    Reactivar
                  </Button>
                )}
                <Button asChild variant="outline">
                  <Link href={`${basePath}/${owner.idUsuario}`}>Perfil</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8} className="h-5 text-center"></TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Dialog open={!!confirm} onOpenChange={(v) => { if (!v) setConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="sr-only" />
          <DialogDescription className="sr-only" />
          <div className="py-4 text-center">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {confirm && msgs[confirm.action]?.title}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {confirm && msgs[confirm.action]?.desc}
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant={confirm?.action === "activar" ? "default" : "destructive"}
              onClick={handleConfirm}
            >
              {confirm?.action === "activar"
                ? "Sí, reactivar"
                : confirm?.action === "desactivar"
                  ? "Sí, desactivar"
                  : "Sí, eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientTable;
