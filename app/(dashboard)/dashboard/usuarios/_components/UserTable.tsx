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

// Contratos de Dominio
import { Usuario } from "@/types/usuario";

type Props = {
  usuarios: Usuario[];
  onEdit: (id: number, usuario: Omit<Usuario, "id">) => void;
  onDelete: (id: number) => void;
};

const UserTable = ({ usuarios, onEdit, onDelete }: Props) => {
  return (
    <Table>
      <TableCaption>Lista de Usuarios</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Especialidad</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="w-25"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usuarios.map((usuario) => (
          <TableRow key={usuario.id}>
            <TableCell className="font-medium">{usuario.id}</TableCell>
            <TableCell>{usuario.nombre}</TableCell>
            <TableCell>{usuario.email}</TableCell>
            <TableCell>{usuario.rol}</TableCell>
            <TableCell>{usuario.especialidad}</TableCell>
            <TableCell>{usuario.estado ? "Activo" : "Inactivo"}</TableCell>
            <TableCell className="flex justify-between">
              {/* Dialog editar*/}
              <UserFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                data={usuario}
                onSubmit={(data) => onEdit(usuario.id, data)}
              />
              {/* Botón eliminar */}
              <Button
                variant="destructive"
                onClick={() => {
                  const confirmar = window.confirm(
                    `¿Seguro que deseas eliminar el servicio "${usuario.nombre}"?`,
                  );

                  if (!confirmar) return;

                  onDelete(usuario.id);
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
          <TableCell colSpan={7} className="text-center h-5"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default UserTable;
