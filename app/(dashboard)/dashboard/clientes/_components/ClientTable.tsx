"use client";

import { SquarePen, Trash } from "lucide-react";
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

import ClientFormDialog from "./ClientFormDialog";

import { Owner } from "@/types/owner";
import type { OwnerRequest } from "@/types/owner";

type Props = {
  owners: Owner[];
  onEdit: (id: number, data: OwnerRequest) => Promise<void>;
  onDelete: (id: number) => void;
};

const ClientTable = ({ owners, onEdit, onDelete }: Props) => {
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
          <TableRow key={owner.idOwner}>
            <TableCell className="font-medium">{owner.idOwner}</TableCell>
            <TableCell>{owner.names}</TableCell>
            <TableCell>{owner.lastNames}</TableCell>
            <TableCell>{owner.email}</TableCell>
            <TableCell>{owner.phoneNumber}</TableCell>
            <TableCell>{owner.address}</TableCell>
            <TableCell className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/dashboard/clientes/${owner.idOwner}`}>Perfil</Link>
              </Button>
              <ClientFormDialog
                mode="edit"
                icon={SquarePen}
                buttonColor="alert"
                data={owner}
                onSubmit={(data) => onEdit(owner.idOwner, data)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const confirmar = window.confirm(
                    `¿Seguro que deseas eliminar al cliente "${owner.names} ${owner.lastNames}"?`,
                  );

                  if (!confirmar) return;

                  onDelete(owner.idOwner);
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
