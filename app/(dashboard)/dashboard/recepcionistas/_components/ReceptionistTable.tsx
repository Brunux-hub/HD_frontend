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

import ReceptionistFormDialog from "./ReceptionistFormDialog";

import type { UserItem } from "@/types/user";
import type {
  CreateReceptionistRequest,
  ReceptionistItem,
} from "@/types/recepcionista";

type Props = {
  receptionists: ReceptionistItem[];
  users: UserItem[];
  loading?: boolean;
  onEdit: (id: number, data: CreateReceptionistRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const ReceptionistTable = ({
  receptionists,
  users,
  loading = false,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Table>
      <TableCaption>Lista de Recepcionistas</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Nombres</TableHead>
          <TableHead>Apellidos</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              Cargando recepcionistas...
            </TableCell>
          </TableRow>
        ) : receptionists.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              No hay recepcionistas para mostrar.
            </TableCell>
          </TableRow>
        ) : (
          receptionists.map((receptionist) => (
            <TableRow key={receptionist.idReceptionist}>
              <TableCell className="font-medium">{receptionist.idReceptionist}</TableCell>
              <TableCell>{receptionist.user.username}</TableCell>
              <TableCell>{receptionist.user.type}</TableCell>
              <TableCell>{receptionist.names}</TableCell>
              <TableCell>{receptionist.lastNames}</TableCell>
              <TableCell>{receptionist.email}</TableCell>
              <TableCell>{receptionist.phoneNumber}</TableCell>
              <TableCell className="flex gap-2">
                <ReceptionistFormDialog
                  users={users}
                  mode="edit"
                  icon={SquarePen}
                  buttonColor="alert"
                  data={receptionist}
                  onSubmit={(data) => onEdit(receptionist.idReceptionist, data)}
                />
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const confirmar = window.confirm(
                      `¿Seguro que deseas eliminar al recepcionista "${receptionist.names} ${receptionist.lastNames}"?`,
                    );

                    if (!confirmar) return;

                    await onDelete(receptionist.idReceptionist);
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
          <TableCell colSpan={8} className="text-center h-5"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ReceptionistTable;
