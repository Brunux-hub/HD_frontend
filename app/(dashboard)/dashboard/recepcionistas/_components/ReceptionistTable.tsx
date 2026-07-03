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

import ReceptionistFormDialog from "./ReceptionistFormDialog";

import { Receptionist, ReceptionistRequest } from "@/types/receptionist";
import { User } from "@/types/user";

type Props = {
  receptionists: Receptionist[];
  users: User[];
  onEdit: (id: number, receptionist: ReceptionistRequest) => void;
  onDelete: (id: number) => void;
};

const PAGE_SIZE = 8;

const ReceptionistTable = ({ receptionists, users, onEdit, onDelete }: Props) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(receptionists.length / PAGE_SIZE);
  const paginated = receptionists.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((receptionist) => (
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

export default ReceptionistTable;
