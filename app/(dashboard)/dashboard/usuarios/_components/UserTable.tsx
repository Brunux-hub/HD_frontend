"use client";

import { useState } from "react";
import { SquarePen } from "lucide-react";

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

import UserFormDialog from "./UserFormDialog";

import { User } from "@/types/user";

const tipoLabel = (t: string) => (t === "ADMIN" ? "Administrador" : t);

type ConfirmAction = {
  id: number;
  correo: string;
  action: "activar" | "desactivar";
};

type Props = {
  users: User[];
  onUpdatePassword: (id: number, data: { contraseniaActual: string; nuevaContrasenia: string }) => Promise<void>;
  onActivate: (id: number) => Promise<void>;
  onDeactivate: (id: number) => Promise<void>;
};

const UserTable = ({ users, onUpdatePassword, onActivate, onDeactivate }: Props) => {
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);

  const handleConfirm = async () => {
    if (!confirm) return;
    if (confirm.action === "activar") await onActivate(confirm.id);
    else if (confirm.action === "desactivar") await onDeactivate(confirm.id);
    setConfirm(null);
  };

  const msgs: Record<ConfirmAction["action"], { title: string; desc: string }> = {
    activar: {
      title: "Reactivar usuario",
      desc: `¿Estás seguro de reactivar a "${confirm?.correo}"?`,
    },
    desactivar: {
      title: "Desactivar usuario",
      desc: `¿Estás seguro de desactivar a "${confirm?.correo}"?`,
    },

  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="w-25"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.idUsuario}>
              <TableCell>
                <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${user.habilitado ? "bg-green-500" : "bg-red-500"}`} />
                {user.correo}
              </TableCell>
              <TableCell>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    user.rol === "ADMIN"
                      ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {tipoLabel(user.rol)}
                </span>
              </TableCell>
              <TableCell className="flex justify-between gap-2">
                {user.habilitado ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirm({ id: user.idUsuario, correo: user.correo, action: "desactivar" })}
                  >
                    Desactivar
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirm({ id: user.idUsuario, correo: user.correo, action: "activar" })}
                  >
                    Reactivar
                  </Button>
                )}
                <UserFormDialog
                  icon={SquarePen}
                  mode="edit"
                  buttonColor="alert"
                  data={user}
                  onSubmit={(payload) => onUpdatePassword(user.idUsuario, payload as { contraseniaActual: string; nuevaContrasenia: string })}
                />

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="h-5 text-center"></TableCell>
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

export default UserTable;
