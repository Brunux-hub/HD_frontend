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

import ClientFormDialog from "./ClientFormDialog";

import { Cliente } from "@/types/cliente";

type Props = {
  clientes: Cliente[];
  onEdit: (id: number, cliente: Omit<Cliente, "id">) => void;
  onDelete: (id: number) => void;
};

const ClientTable = ({ clientes, onEdit, onDelete }: Props) => {
  return (
    <Table>
      <TableCaption>Lista de Clientes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Telefono</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Direccion</TableHead>
          <TableHead className="w-25"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente) => (
          <TableRow key={cliente.id}>
            <TableCell className="font-medium">{cliente.id}</TableCell>
            <TableCell>{cliente.nombre}</TableCell>
            <TableCell>{cliente.telefono}</TableCell>
            <TableCell>{cliente.email}</TableCell>
            <TableCell>{cliente.direccion}</TableCell>
            <TableCell className="flex justify-between">
              <ClientFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                data={cliente}
                onSubmit={(data) => onEdit(cliente.id, data)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const confirmar = window.confirm(
                    `Seguro que deseas eliminar al cliente "${cliente.nombre}"?`,
                  );

                  if (!confirmar) return;

                  onDelete(cliente.id);
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
          <TableCell colSpan={6} className="h-5 text-center"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ClientTable;
