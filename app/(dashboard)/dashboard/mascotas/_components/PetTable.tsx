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

import PetFormDialog from "./PetFormDialog";

import { Pet, PetRequest } from "@/types/pet";

const sexoLabel = (g: Pet["pet_gender"]) => (g === "FEMALE" ? "Hembra" : "Macho");
const fmtDate = (iso: string) => (iso ? iso.slice(0, 10) : "—");

type Props = {
  pets: Pet[];
  showOwner?: boolean;
  onEdit?: (id: number, pet: PetRequest) => void;
  onDelete?: (id: number) => void;
};

const PetTable = ({
  pets,
  showOwner = false,
  onEdit,
  onDelete,
}: Props) => {
  const hasActions = Boolean(onEdit && onDelete);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Especie</TableHead>
          <TableHead>Raza</TableHead>
          <TableHead>Sexo</TableHead>
          <TableHead>Nacimiento</TableHead>
          <TableHead>Peso</TableHead>
          {showOwner && <TableHead>Dueño</TableHead>}
          {showOwner && <TableHead>Teléfono</TableHead>}
          {hasActions && <TableHead className="w-32"></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {pets.map((pet) => (
          <TableRow key={pet.id_pet}>
            <TableCell className="font-medium">{pet.id_pet}</TableCell>
            <TableCell>{pet.name}</TableCell>
            <TableCell>{pet.species}</TableCell>
            <TableCell>{pet.race}</TableCell>
            <TableCell>{sexoLabel(pet.pet_gender)}</TableCell>
            <TableCell>{fmtDate(pet.birthdate)}</TableCell>
            <TableCell>{pet.weight}</TableCell>
            {showOwner && (
              <TableCell>
                {pet.owner ? `${pet.owner.nombres} ${pet.owner.apellidos}` : "Sin asignar"}
              </TableCell>
            )}
            {showOwner && <TableCell>{pet.owner?.telefono ?? "—"}</TableCell>}
            {hasActions && onEdit && onDelete && (
              <TableCell className="flex gap-2">
                <PetFormDialog
                  ownerId={pet.owner?.idUsuario ?? 0}
                  icon={SquarePen}
                  mode="edit"
                  buttonColor="alert"
                  data={pet}
                  onSubmit={(payload) => onEdit(pet.id_pet, payload)}
                />
                <Button
                  variant="destructive"
                  onClick={() => {
                    const ok = window.confirm(
                      `¿Seguro que deseas eliminar a la mascota "${pet.name}"?`,
                    );
                    if (!ok) return;
                    onDelete(pet.id_pet);
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
