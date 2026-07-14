"use client";

import { Trash } from "lucide-react";
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

import { ClienteResponse } from "@/types/cliente";

type Props = {
  owners: ClienteResponse[];
  onDelete: (id: number) => void;
};

const ClientTable = ({ owners, onDelete }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
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
            <TableCell className="font-medium">{owner.idUsuario}</TableCell>
            <TableCell>{owner.dni}</TableCell>
            <TableCell>{owner.nombres}</TableCell>
            <TableCell>{owner.apellidos}</TableCell>
            <TableCell>{owner.usuario.correo}</TableCell>
            <TableCell>{owner.telefono}</TableCell>
            <TableCell>{owner.direccion}</TableCell>
            <TableCell className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/dashboard/clientes/${owner.idUsuario}`}>Perfil</Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const confirmar = window.confirm(
                    `¿Seguro que deseas eliminar al cliente "${owner.nombres} ${owner.apellidos}"?`,
                  );
                  if (!confirmar) return;
                  onDelete(owner.idUsuario);
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
          <TableCell colSpan={8} className="h-5 text-center"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ClientTable;
