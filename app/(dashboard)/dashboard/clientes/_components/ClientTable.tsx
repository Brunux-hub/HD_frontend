"use client";

import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import Link from "next/link";

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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Owner } from "@/types/owner";

type Props = {
  owners: Owner[];
  onDelete: (id: number) => void;
};

const PAGE_SIZE = 8;

const ClientTable = ({ owners, onDelete }: Props) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(owners.length / PAGE_SIZE);
  const paginated = owners.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Doc.</TableHead>
          <TableHead>N° Documento</TableHead>
          <TableHead>Nombres</TableHead>
          <TableHead>Apellidos</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Dirección</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((owner) => (
          <TableRow key={owner.id_owner}>
            <TableCell className="font-medium">{owner.id_owner}</TableCell>
            <TableCell>{owner.document_type ?? "DNI"}</TableCell>
            <TableCell>{owner.dni}</TableCell>
            <TableCell>{owner.names}</TableCell>
            <TableCell>{owner.last_names}</TableCell>
            <TableCell>{owner.email}</TableCell>
            <TableCell>{owner.phone_number}</TableCell>
            <TableCell>{owner.address}</TableCell>
            <TableCell className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/dashboard/clientes/${owner.id_owner}`}>Perfil</Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const confirmar = window.confirm(
                    `¿Seguro que deseas eliminar al cliente "${owner.names} ${owner.last_names}"?`,
                  );

                  if (!confirmar) return;

                  onDelete(owner.id_owner);
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
            <TableCell colSpan={9} className="py-3">
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

export default ClientTable;
