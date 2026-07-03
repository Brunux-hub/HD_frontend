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

import ServiceFormDialog from "./ServiceFormDialog";

import { Service, ServiceRequest } from "@/types/service";

type Props = {
  services: Service[];
  onEdit: (id: number, service: ServiceRequest) => void;
  onDelete: (id: number) => void;
};

const PAGE_SIZE = 8;

const ServiceTable = ({ services, onEdit, onDelete }: Props) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(services.length / PAGE_SIZE);
  const paginated = services.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((service) => (
          <TableRow key={service.id_service}>
            <TableCell className="font-medium">{service.id_service}</TableCell>
            <TableCell>{service.name}</TableCell>
            <TableCell>{service.description}</TableCell>
            <TableCell>{service.price}</TableCell>
            <TableCell className="flex justify-between gap-2">
              <ServiceFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                data={service}
                onSubmit={(payload) => onEdit(service.id_service, payload)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const ok = window.confirm(
                    `¿Seguro que deseas eliminar el servicio "${service.name}"?`,
                  );
                  if (!ok) return;
                  onDelete(service.id_service);
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
            <TableCell colSpan={5} className="py-3">
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

export default ServiceTable;
