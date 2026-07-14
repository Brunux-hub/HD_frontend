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
import { ClienteResponse } from "@/types/cliente";

const sexoLabel = (g: string) => (g === "HEMBRA" ? "Hembra" : "Macho");
const fmtDate = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

type Props = {
  pets: Pet[];
  showOwner?: boolean;
  owners?: ClienteResponse[];
  onEdit?: (id: number, pet: PetRequest) => void;
  onDelete?: (id: number) => void;
};

const PetTable = ({
  pets,
  showOwner = false,
  owners,
  onEdit,
  onDelete,
}: Props) => {
  const hasActions = Boolean(onEdit && onDelete);
  const ownerMap = new Map(owners?.map((o) => [o.idUsuario, o]));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Especie</TableHead>
          <TableHead>Raza</TableHead>
          <TableHead>Sexo</TableHead>
          <TableHead>Nacimiento</TableHead>
          {showOwner && <TableHead>Dueño</TableHead>}
          {hasActions && <TableHead className="w-32"></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {pets.map((pet) => (
          <TableRow key={pet.idMascota}>
            <TableCell>{pet.nombre}</TableCell>
            <TableCell>{pet.especie}</TableCell>
            <TableCell>{pet.raza}</TableCell>
            <TableCell>{sexoLabel(pet.sexo)}</TableCell>
            <TableCell>{fmtDate(pet.fechaNacimiento)}</TableCell>
            {showOwner && (
              <TableCell>
                {(() => {
                  const o = ownerMap.get(pet.idUsuarioCliente);
                  return o ? `${o.nombres} ${o.apellidos}` : `ID ${pet.idUsuarioCliente}`;
                })()}
              </TableCell>
            )}
            {hasActions && onEdit && onDelete && (
              <TableCell className="flex gap-2">
                <PetFormDialog
                  ownerId={pet.idUsuarioCliente}
                  icon={SquarePen}
                  mode="edit"
                  buttonColor="alert"
                  data={pet}
                  onSubmit={(payload) => onEdit(pet.idMascota, payload)}
                />
                <Button
                  variant="destructive"
                  onClick={() => {
                    const ok = window.confirm(
                      `¿Seguro que deseas eliminar a la mascota "${pet.nombre}"?`,
                    );
                    if (!ok) return;
                    onDelete(pet.idMascota);
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
            colSpan={showOwner ? (hasActions ? 8 : 7) : hasActions ? 7 : 6}
            className="h-5 text-center"
          ></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default PetTable;
