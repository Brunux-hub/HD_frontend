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

import MedicalHistoryFormDialog from "./MedicalHistoryFormDialog";

import { MedicalHistory, MedicalHistoryRequest } from "@/types/medicalHistory";
import { Appointment } from "@/types/appointment";
import { Service } from "@/types/service";

type Props = {
  medicalHistories: MedicalHistory[];
  appointments: Appointment[];
  services: Service[];
  onEdit: (id: number, medicalHistory: MedicalHistoryRequest) => void;
  onDelete: (id: number) => void;
};

const PAGE_SIZE = 8;

const MedicalHistoryTable = ({
  medicalHistories,
  appointments,
  services,
  onEdit,
  onDelete,
}: Props) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(medicalHistories.length / PAGE_SIZE);
  const paginated = medicalHistories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cita</TableHead>
          <TableHead>Servicio</TableHead>
          <TableHead>Peso</TableHead>
          <TableHead>Diagnóstico</TableHead>
          <TableHead>Tratamiento</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((mh) => (
          <TableRow key={mh.id_medical_history}>
            <TableCell className="font-medium">{mh.id_medical_history}</TableCell>
            <TableCell>
              {`#${mh.appointment?.id_appointment} ${mh.appointment?.pet?.name}`}
            </TableCell>
            <TableCell>{mh.services?.name}</TableCell>
            <TableCell>{mh.weight}</TableCell>
            <TableCell>{mh.diagnosis}</TableCell>
            <TableCell>{mh.treatment}</TableCell>
            <TableCell className="flex justify-between gap-2">
              <MedicalHistoryFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                data={mh}
                appointments={appointments}
                services={services}
                onSubmit={(payload) => onEdit(mh.id_medical_history, payload)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const ok = window.confirm(
                    `¿Seguro que deseas eliminar el historial médico #${mh.id_medical_history}?`,
                  );
                  if (!ok) return;
                  onDelete(mh.id_medical_history);
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
            <TableCell colSpan={7} className="py-3">
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

export default MedicalHistoryTable;
