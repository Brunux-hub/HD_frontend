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

type Props = {
  receptionists: Receptionist[];
  onEdit: (id: number, receptionist: ReceptionistRequest) => void;
  onDelete: (id: number) => void;
};

const ReceptionistTable = ({ receptionists, onEdit, onDelete }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Nombres y Apellidos</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead className="w-25"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receptionists.map((receptionist) => (
          <TableRow key={receptionist.idUsuario}>
            <TableCell className="font-medium">{receptionist.idUsuario}</TableCell>
            <TableCell>
              {receptionist.nombres} {receptionist.apellidos}
            </TableCell>
            <TableCell>{receptionist.usuario.correo}</TableCell>
            <TableCell>{receptionist.telefono}</TableCell>
            <TableCell className="flex justify-between gap-2">
              <ReceptionistFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                data={receptionist}
                onSubmit={(payload) => onEdit(receptionist.idUsuario, payload)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const ok = window.confirm(
                    `¿Seguro que deseas eliminar al recepcionista "${receptionist.nombres} ${receptionist.apellidos}"?`,
                  );
                  if (!ok) return;
                  onDelete(receptionist.idUsuario);
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
          <TableCell colSpan={5} className="h-5 text-center"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ReceptionistTable;
