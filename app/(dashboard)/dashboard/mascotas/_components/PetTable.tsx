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

import PetFormDialog from "./PetFormDialog";

import { Cliente } from "@/types/cliente";
import { Mascota } from "@/types/mascota";

type Props = {
  mascotas: Mascota[];
  ownersById?: Record<number, Cliente | undefined>;
  showOwner?: boolean;
  caption?: string;
  onEdit?: (id: number, mascota: Omit<Mascota, "id">) => void;
  onDelete?: (id: number) => void;
};

const PetTable = ({
  mascotas,
  ownersById,
  showOwner = false,
  caption = "Lista de Mascotas",
  onEdit,
  onDelete,
}: Props) => {
  const hasActions = Boolean(onEdit && onDelete);

  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Especie</TableHead>
          <TableHead>Raza</TableHead>
          <TableHead>Edad</TableHead>
          <TableHead>Sexo</TableHead>
          <TableHead>Fecha nacimiento</TableHead>
          {showOwner && <TableHead>Dueño principal</TableHead>}
          {showOwner && <TableHead>Telefono</TableHead>}
          {hasActions && <TableHead className="w-32"></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {mascotas.map((mascota) => {
          const owner = ownersById?.[mascota.clienteId];

          return (
            <TableRow key={mascota.id}>
              <TableCell className="font-medium">{mascota.id}</TableCell>
              <TableCell>{mascota.nombre}</TableCell>
              <TableCell>{mascota.especie}</TableCell>
              <TableCell>{mascota.raza}</TableCell>
              <TableCell>{mascota.edad}</TableCell>
              <TableCell>{mascota.sexo}</TableCell>
              <TableCell>{mascota.fechaNacimiento}</TableCell>
              {showOwner && <TableCell>{owner?.nombre ?? "Sin asignar"}</TableCell>}
              {showOwner && <TableCell>{owner?.telefono ?? "Sin telefono"}</TableCell>}
              {hasActions && onEdit && onDelete && (
                <TableCell className="flex gap-2">
                  <PetFormDialog
                    clienteId={mascota.clienteId}
                    icon={SquarePen}
                    mode="edit"
                    buttonColor="alert"
                    data={mascota}
                    onSubmit={(data) => onEdit(mascota.id, data)}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const confirmar = window.confirm(
                        `Seguro que deseas eliminar a la mascota "${mascota.nombre}"?`,
                      );

                      if (!confirmar) return;

                      onDelete(mascota.id);
                    }}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell
            colSpan={showOwner ? (hasActions ? 10 : 9) : hasActions ? 8 : 7}
            className="h-5 text-center"
          ></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default PetTable;
