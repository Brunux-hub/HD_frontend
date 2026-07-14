"use client";

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

import UserFormDialog from "./UserFormDialog";

import { User, UserRequest } from "@/types/user";

const tipoLabel = (t: User["type"]) => (t === "ADMIN" ? "Administrador" : "Trabajador");

type Props = {
  users: User[];
  onEdit: (id: number, user: UserRequest) => void;
  onDelete: (id: number) => void;
};

const UserTable = ({ users, onEdit, onDelete }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="w-25"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id_user}>
            <TableCell>{user.username}</TableCell>
            <TableCell>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  user.type === "ADMIN"
                    ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {tipoLabel(user.type)}
              </span>
            </TableCell>
            <TableCell className="flex justify-between gap-2">
              <UserFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                data={user}
                onSubmit={(payload) => onEdit(user.id_user, payload)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const ok = window.confirm(
                    `¿Seguro que deseas eliminar al usuario "${user.username}"?`,
                  );
                  if (!ok) return;
                  onDelete(user.id_user);
                }}
              >
                <Trash />
              </Button>
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
  );
};

export default UserTable;
