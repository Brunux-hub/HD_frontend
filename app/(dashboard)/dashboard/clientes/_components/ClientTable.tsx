"use client";

import { Trash } from "lucide-react";
import Link from "next/link";

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

import { Owner } from "@/types/owner";

type Props = {
  owners: Owner[];
  onDelete: (id: number) => void;
};

const ClientTable = ({ owners, onDelete }: Props) => {
  return (
    <Table>
      <TableCaption>Lista de Clientes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Nombres</TableHead>
          <TableHead>Apellidos</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Dirección</TableHead>
          <TableHead className="w-25"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {owners.map((owner) => (
          <TableRow key={owner.id_owner}>
            <TableCell className="font-medium">{owner.id_owner}</TableCell>
            <TableCell>{owner.names}</TableCell>
            <TableCell>{owner.last_names}</TableCell>
            <TableCell>{owner.email}</TableCell>
            <TableCell>{owner.phone_number}</TableCell>
            <TableCell>{owner.address}</TableCell>
            <TableCell className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/dashboard/clientes/${owner.id_owner}`}>Perfil</Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const confirmar = window.confirm(
                    `¿Seguro que deseas eliminar al cliente "${owner.names} ${owner.last_names}"?`,
                  );

                  if (!confirmar) return;

                  onDelete(owner.id_owner);
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
          <TableCell colSpan={7} className="h-5 text-center"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ClientTable;
