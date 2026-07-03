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

import VetFormDialog from "./VetFormDialog";

import { Veterinarian, VeterinarianRequest } from "@/types/veterinarian";
import { User } from "@/types/user";

type Props = {
  veterinarians: Veterinarian[];
  users: User[];
  onEdit: (id: number, vet: VeterinarianRequest) => void;
  onDelete: (id: number) => void;
};

const VetTable = ({ veterinarians, users, onEdit, onDelete }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Licencia</TableHead>
          <TableHead>Especialidad</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead className="w-25"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {veterinarians.map((vet) => (
          <TableRow key={vet.id_veterinarian}>
            <TableCell className="font-medium">{vet.id_veterinarian}</TableCell>
            <TableCell>
              {vet.names} {vet.last_names}
            </TableCell>
            <TableCell>{vet.number_license}</TableCell>
            <TableCell>{vet.specialty}</TableCell>
            <TableCell>{vet.email}</TableCell>
            <TableCell>{vet.phone_number}</TableCell>
            <TableCell>{vet.user_response.username}</TableCell>
            <TableCell className="flex justify-between gap-2">
              <VetFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                users={users}
                data={vet}
                onSubmit={(payload) => onEdit(vet.id_veterinarian, payload)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const ok = window.confirm(
                    `¿Seguro que deseas eliminar al veterinario "${vet.names} ${vet.last_names}"?`,
                  );
                  if (!ok) return;
                  onDelete(vet.id_veterinarian);
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

export default VetTable;
