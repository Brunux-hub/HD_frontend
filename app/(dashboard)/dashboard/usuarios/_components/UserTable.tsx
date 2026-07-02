"use client";

import { SquarePen, Trash } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import UserFormDialog from "./UserFormDialog";

import type { CreateUserRequest, UserItem } from "@/types/user";

type Props = {
  usuarios: UserItem[];
  loading?: boolean;
  onEdit: (id: number, payload: CreateUserRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const UserTable = ({ usuarios, loading = false, onEdit, onDelete }: Props) => {
  return (
    <Table>
      <TableCaption>Lista de Usuarios</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              Cargando usuarios...
            </TableCell>
          </TableRow>
        ) : usuarios.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No hay usuarios para mostrar.
            </TableCell>
          </TableRow>
        ) : (
          usuarios.map((usuario) => (
            <TableRow key={usuario.id_user}>
              <TableCell className="font-medium">{usuario.id_user}</TableCell>
              <TableCell>{usuario.username}</TableCell>
              <TableCell>{usuario.type}</TableCell>
              <TableCell className="flex gap-2">
                <UserFormDialog
                  icon={SquarePen}
                  mode="edit"
                  buttonColor="alert"
                  data={usuario}
                  onSubmit={(data) => onEdit(usuario.id_user, data)}
                />
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const confirmar = window.confirm(
                      `¿Seguro que deseas eliminar el usuario "${usuario.username}"?`,
                    );

                    if (!confirmar) return;

                    await onDelete(usuario.id_user);
                  }}
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4} className="text-center h-5"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default UserTable;
