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

type Props = {
  veterinarians: Veterinarian[];
  onEdit: (id: number, vet: VeterinarianRequest) => void;
  onDelete: (id: number) => void;
};

const VetTable = ({ veterinarians, onEdit, onDelete }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Nombres y Apellidos</TableHead>
          <TableHead>Licencia</TableHead>
          <TableHead>Especialidades</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead className="w-25"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {veterinarians.map((vet) => (
          <TableRow key={vet.idUsuario}>
            <TableCell className="font-medium">{vet.idUsuario}</TableCell>
            <TableCell>
              {vet.nombres} {vet.apellidos}
            </TableCell>
            <TableCell>{vet.numeroLicencia}</TableCell>
            <TableCell>{vet.especialidades.join(", ")}</TableCell>
            <TableCell>{vet.usuario.correo}</TableCell>
            <TableCell>{vet.telefono}</TableCell>
            <TableCell className="flex justify-between gap-2">
              <VetFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                data={vet}
                onSubmit={(payload) => onEdit(vet.idUsuario, payload)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const ok = window.confirm(
                    `¿Seguro que deseas eliminar al veterinario "${vet.nombres} ${vet.apellidos}"?`,
                  );
                  if (!ok) return;
                  onDelete(vet.idUsuario);
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

export default VetTable;
