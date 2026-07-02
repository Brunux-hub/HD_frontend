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

import VeterinarianFormDialog from "./VeterinarianFormDialog";

import type { UserItem } from "@/types/user";
import type {
  CreateVeterinarianRequest,
  VeterinarianItem,
} from "@/types/veterinario";

type Props = {
  veterinarians: VeterinarianItem[];
  users: UserItem[];
  loading?: boolean;
  onEdit: (id: number, data: CreateVeterinarianRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const VeterinarianTable = ({
  veterinarians,
  users,
  loading = false,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Table>
      <TableCaption>Lista de Veterinarios</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Nombres</TableHead>
          <TableHead>Apellidos</TableHead>
          <TableHead>Colegiatura</TableHead>
          <TableHead>Especialidad</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={10} className="text-center">
              Cargando veterinarios...
            </TableCell>
          </TableRow>
        ) : veterinarians.length === 0 ? (
          <TableRow>
            <TableCell colSpan={10} className="text-center">
              No hay veterinarios para mostrar.
            </TableCell>
          </TableRow>
        ) : (
          veterinarians.map((veterinarian) => (
            <TableRow key={veterinarian.idVeterinarian}>
              <TableCell className="font-medium">{veterinarian.idVeterinarian}</TableCell>
              <TableCell>{veterinarian.userResponse.username}</TableCell>
              <TableCell>{veterinarian.userResponse.type}</TableCell>
              <TableCell>{veterinarian.names}</TableCell>
              <TableCell>{veterinarian.lastNames}</TableCell>
              <TableCell>{veterinarian.numberLicense}</TableCell>
              <TableCell>{veterinarian.specialty}</TableCell>
              <TableCell>{veterinarian.email}</TableCell>
              <TableCell>{veterinarian.phoneNumber}</TableCell>
              <TableCell className="flex gap-2">
                <VeterinarianFormDialog
                  users={users}
                  mode="edit"
                  icon={SquarePen}
                  buttonColor="alert"
                  data={veterinarian}
                  onSubmit={(data) => onEdit(veterinarian.idVeterinarian, data)}
                />
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const confirmar = window.confirm(
                      `¿Seguro que deseas eliminar al veterinario "${veterinarian.names} ${veterinarian.lastNames}"?`,
                    );

                    if (!confirmar) return;

                    await onDelete(veterinarian.idVeterinarian);
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
          <TableCell colSpan={10} className="text-center h-5"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default VeterinarianTable;
