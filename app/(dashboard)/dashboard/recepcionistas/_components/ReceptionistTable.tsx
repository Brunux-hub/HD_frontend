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

import ReceptionistFormDialog from "./ReceptionistFormDialog";

import { Receptionist, ReceptionistRequest } from "@/types/receptionist";
import { User } from "@/types/user";

type Props = {
  receptionists: Receptionist[];
  users: User[];
  onEdit: (id: number, receptionist: ReceptionistRequest) => void;
  onDelete: (id: number) => void;
};

const ReceptionistTable = ({ receptionists, users, onEdit, onDelete }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead className="w-25"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receptionists.map((receptionist) => (
          <TableRow key={receptionist.id_receptionist}>
            <TableCell className="font-medium">{receptionist.id_receptionist}</TableCell>
            <TableCell>
              {receptionist.names} {receptionist.last_names}
            </TableCell>
            <TableCell>{receptionist.email}</TableCell>
            <TableCell>{receptionist.phone_number}</TableCell>
            <TableCell>{receptionist.user.username}</TableCell>
            <TableCell className="flex justify-between gap-2">
              <ReceptionistFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                users={users}
                data={receptionist}
                onSubmit={(payload) => onEdit(receptionist.id_receptionist, payload)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const ok = window.confirm(
                    `¿Seguro que deseas eliminar al recepcionista "${receptionist.names} ${receptionist.last_names}"?`,
                  );
                  if (!ok) return;
                  onDelete(receptionist.id_receptionist);
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

export default ReceptionistTable;
