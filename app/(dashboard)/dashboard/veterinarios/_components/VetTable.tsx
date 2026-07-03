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

import VetFormDialog from "./VetFormDialog";

import { Veterinarian, VeterinarianRequest } from "@/types/veterinarian";
import { User } from "@/types/user";

type Props = {
  veterinarians: Veterinarian[];
  users: User[];
  onEdit: (id: number, vet: VeterinarianRequest) => void;
  onDelete: (id: number) => void;
};

const PAGE_SIZE = 8;

const VetTable = ({ veterinarians, users, onEdit, onDelete }: Props) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(veterinarians.length / PAGE_SIZE);
  const paginated = veterinarians.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Licencia</TableHead>
          <TableHead>Especialidad</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((vet) => (
          <TableRow key={vet.id_veterinarian}>
            <TableCell className="font-medium">{vet.id_veterinarian}</TableCell>
            <TableCell>
              {vet.names} {vet.last_names}
            </TableCell>
            <TableCell>{vet.number_license}</TableCell>
            <TableCell>{vet.specialty}</TableCell>
            <TableCell>{vet.email}</TableCell>
            <TableCell>{vet.phone_number}</TableCell>
            <TableCell>{vet.user_response.username}</TableCell>
            <TableCell className="flex justify-between gap-2">
              <VetFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                users={users}
                data={vet}
                onSubmit={(payload) => onEdit(vet.id_veterinarian, payload)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const ok = window.confirm(
                    `¿Seguro que deseas eliminar al veterinario "${vet.names} ${vet.last_names}"?`,
                  );
                  if (!ok) return;
                  onDelete(vet.id_veterinarian);
                }}
              >
                <Trash />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {totalPages > 1 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8} className="py-3">
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

export default VetTable;
