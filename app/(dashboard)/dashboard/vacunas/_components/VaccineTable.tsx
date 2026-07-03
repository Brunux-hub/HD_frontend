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

import VaccineFormDialog from "./VaccineFormDialog";

import { Vaccine, VaccineRequest } from "@/types/vaccine";

type Props = {
  vaccines: Vaccine[];
  onEdit: (id: number, vaccine: VaccineRequest) => void;
  onDelete: (id: number) => void;
};

const PAGE_SIZE = 8;

const VaccineTable = ({ vaccines, onEdit, onDelete }: Props) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(vaccines.length / PAGE_SIZE);
  const paginated = vaccines.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Fabricante</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Dosis</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((vaccine) => (
          <TableRow key={vaccine.id_vaccine}>
            <TableCell className="font-medium">{vaccine.id_vaccine}</TableCell>
            <TableCell>{vaccine.name}</TableCell>
            <TableCell>{vaccine.manufacturer}</TableCell>
            <TableCell>{vaccine.description}</TableCell>
            <TableCell>{vaccine.required_dose}</TableCell>
            <TableCell className="flex justify-between gap-2">
              <VaccineFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                data={vaccine}
                onSubmit={(payload) => onEdit(vaccine.id_vaccine, payload)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const ok = window.confirm(
                    `¿Seguro que deseas eliminar la vacuna "${vaccine.name}"?`,
                  );
                  if (!ok) return;
                  onDelete(vaccine.id_vaccine);
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
            <TableCell colSpan={6} className="py-3">
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

export default VaccineTable;
