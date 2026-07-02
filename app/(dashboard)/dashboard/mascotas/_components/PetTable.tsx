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

import type { Owner } from "@/types/owner";
import type { CreatePetRequest, PetItem } from "@/types/mascota";

const genderLabel: Record<PetItem["petGender"], string> = {
  MALE: "Macho",
  FEMALE: "Hembra",
};

type Props = {
  mascotas: PetItem[];
  owners?: Owner[];
  showOwner?: boolean;
  caption?: string;
  onEdit?: (id: number, mascota: CreatePetRequest) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
};

const PetTable = ({
  mascotas,
  owners = [],
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
          <TableHead>Peso</TableHead>
          <TableHead>Sexo</TableHead>
          <TableHead>Fecha nacimiento</TableHead>
          {showOwner && <TableHead>Dueño principal</TableHead>}
          {showOwner && <TableHead>Teléfono</TableHead>}
          {hasActions && <TableHead className="w-32"></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {mascotas.map((mascota) => (
          <TableRow key={mascota.idPet}>
            <TableCell className="font-medium">{mascota.idPet}</TableCell>
            <TableCell>{mascota.name}</TableCell>
            <TableCell>{mascota.species}</TableCell>
            <TableCell>{mascota.race}</TableCell>
            <TableCell>{mascota.weight}</TableCell>
            <TableCell>{genderLabel[mascota.petGender]}</TableCell>
            <TableCell>{mascota.birthdate.slice(0, 10)}</TableCell>
            {showOwner && <TableCell>{mascota.owner.names}</TableCell>}
            {showOwner && <TableCell>{mascota.owner.phoneNumber}</TableCell>}
            {hasActions && onEdit && onDelete && (
              <TableCell className="flex gap-2">
                <PetFormDialog
                  ownerId={mascota.owner.idOwner}
                  owners={owners}
                  icon={SquarePen}
                  mode="edit"
                  buttonColor="alert"
                  data={mascota}
                  onSubmit={(data) => onEdit(mascota.idPet, data)}
                />
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const confirmar = window.confirm(
                      `Seguro que deseas eliminar a la mascota "${mascota.name}"?`,
                    );

                    if (!confirmar) return;

                    await onDelete(mascota.idPet);
                  }}
                >
                  <Trash />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
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
