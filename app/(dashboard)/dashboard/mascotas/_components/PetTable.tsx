"use client";

import { useEffect, useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import PetFormDialog from "./PetFormDialog";

import { Pet, PetRequest } from "@/types/pet";
import { fmtDate } from "@/lib/utils";

const sexoLabel = (g: Pet["pet_gender"]) => (g === "FEMALE" ? "Hembra" : "Macho");
const especieLabel = (s: string) => (s === "CAT" ? "Gato" : "Perro");

type Props = {
  pets: Pet[];
  showOwner?: boolean;
  onEdit?: (id: number, pet: PetRequest) => void;
  onDelete?: (id: number) => void;
};

const PAGE_SIZE = 8;

const PetTable = ({
  pets,
  showOwner = false,
  onEdit,
  onDelete,
}: Props) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(pets.length / PAGE_SIZE);
  const paginated = pets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasActions = Boolean(onEdit && onDelete);
  const colSpan = 6 + (showOwner ? 2 : 0) + (hasActions ? 1 : 0);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Especie</TableHead>
          <TableHead>Raza</TableHead>
          <TableHead>Sexo</TableHead>
          <TableHead>Nacimiento</TableHead>
          {showOwner && <TableHead>Dueño</TableHead>}
          {showOwner && <TableHead>Teléfono</TableHead>}
          {hasActions && <TableHead></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((pet) => (
          <TableRow key={pet.id_pet}>
            <TableCell className="font-medium">{pet.id_pet}</TableCell>
            <TableCell>{pet.name}</TableCell>
            <TableCell>{especieLabel(pet.species)}</TableCell>
            <TableCell>{pet.race}</TableCell>
            <TableCell>{sexoLabel(pet.pet_gender)}</TableCell>
            <TableCell>{fmtDate(pet.birthdate)}</TableCell>
            {showOwner && (
              <TableCell>
                {pet.owner ? `${pet.owner.names} ${pet.owner.last_names}` : "Sin asignar"}
              </TableCell>
            )}
            {showOwner && <TableCell>{pet.owner?.phone_number ?? "—"}</TableCell>}
            {hasActions && onEdit && onDelete && (
              <TableCell className="flex gap-2">
                <PetFormDialog
                  ownerId={pet.owner?.id_owner ?? 0}
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
      {totalPages > 1 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={colSpan} className="py-3">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};

export default PetTable;
