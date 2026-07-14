"use client";

import { useState } from "react";
import { SquarePen, Trash } from "lucide-react";

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

import ReceptionistFormDialog from "./ReceptionistFormDialog";

import { Receptionist, ReceptionistRequest } from "@/types/receptionist";

type ConfirmAction = {
  id: number;
  nombre: string;
  action: "activar" | "desactivar" | "eliminar";
};

type Props = {
  receptionists: Receptionist[];
  onEdit: (id: number, receptionist: ReceptionistRequest) => void;
  onDelete: (id: number) => void;
  onActivate: (id: number) => Promise<void>;
  onDeactivate: (id: number) => Promise<void>;
};

const ReceptionistTable = ({ receptionists, onEdit, onDelete, onActivate, onDeactivate }: Props) => {
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);

  const handleConfirm = async () => {
    if (!confirm) return;
    if (confirm.action === "activar") await onActivate(confirm.id);
    else if (confirm.action === "desactivar") await onDeactivate(confirm.id);
    else if (confirm.action === "eliminar") await onDelete(confirm.id);
    setConfirm(null);
  };

  const msgs: Record<ConfirmAction["action"], { title: string; desc: string }> = {
    activar: {
      title: "Reactivar recepcionista",
      desc: `¿Estás seguro de reactivar a "${confirm?.nombre}"?`,
    },
    desactivar: {
      title: "Desactivar recepcionista",
      desc: `¿Estás seguro de desactivar a "${confirm?.nombre}"?`,
    },
    eliminar: {
      title: "Eliminar recepcionista",
      desc: `¿Estás seguro de eliminar a "${confirm?.nombre}"? Esta acción no se puede deshacer.`,
    },
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombres y Apellidos</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="w-25"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receptionists.map((receptionist) => (
            <TableRow key={receptionist.idUsuario}>
              <TableCell>
                <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${receptionist.usuario.habilitado ? "bg-green-500" : "bg-red-500"}`} />
                {receptionist.nombres} {receptionist.apellidos}
              </TableCell>
              <TableCell>{receptionist.usuario.correo}</TableCell>
              <TableCell>{receptionist.telefono}</TableCell>
              <TableCell className="flex justify-between gap-2">
                {receptionist.usuario.habilitado ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirm({ id: receptionist.idUsuario, nombre: `${receptionist.nombres} ${receptionist.apellidos}`, action: "desactivar" })}
                  >
                    Desactivar
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirm({ id: receptionist.idUsuario, nombre: `${receptionist.nombres} ${receptionist.apellidos}`, action: "activar" })}
                  >
                    Reactivar
                  </Button>
                )}
                <ReceptionistFormDialog
                  icon={SquarePen}
                  mode="edit"
                  buttonColor="alert"
                  data={receptionist}
                  onSubmit={(payload) => onEdit(receptionist.idUsuario, payload)}
                />
                <Button
                  variant="destructive"
                  onClick={() => setConfirm({ id: receptionist.idUsuario, nombre: `${receptionist.nombres} ${receptionist.apellidos}`, action: "eliminar" })}
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="h-5 text-center"></TableCell>
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

export default ReceptionistTable;
