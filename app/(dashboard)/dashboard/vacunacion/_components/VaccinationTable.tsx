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

import VaccinationFormDialog from "./VaccinationFormDialog";

import { Vaccination, VaccinationRequest } from "@/types/vaccination";
import { MedicalHistory } from "@/types/medicalHistory";
import { Vaccine } from "@/types/vaccine";
import { fmtDate } from "@/lib/utils";

type Props = {
  vaccinations: Vaccination[];
  medicalHistories: MedicalHistory[];
  vaccines: Vaccine[];
  onEdit: (id: number, vaccination: VaccinationRequest) => void;
  onDelete: (id: number) => void;
};

const PAGE_SIZE = 8;

const VaccinationTable = ({
  vaccinations,
  medicalHistories,
  vaccines,
  onEdit,
  onDelete,
}: Props) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(vaccinations.length / PAGE_SIZE);
  const paginated = vaccinations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Vacuna</TableHead>
          <TableHead>Historial</TableHead>
          <TableHead>Aplicación</TableHead>
          <TableHead>Próxima</TableHead>
          <TableHead>Observación</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((vac) => (
          <TableRow key={vac.id_vaccination}>
            <TableCell className="font-medium">{vac.id_vaccination}</TableCell>
            <TableCell>{vac.vaccine?.name}</TableCell>
            <TableCell>#{vac.medical_history?.id_medical_history}</TableCell>
            <TableCell>{fmtDate(vac.application_date)}</TableCell>
            <TableCell>{fmtDate(vac.next_application_date)}</TableCell>
            <TableCell>{vac.observation}</TableCell>
            <TableCell className="flex justify-between gap-2">
              <VaccinationFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                data={vac}
                medicalHistories={medicalHistories}
                vaccines={vaccines}
                onSubmit={(payload) => onEdit(vac.id_vaccination, payload)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const ok = window.confirm(
                    `¿Seguro que deseas eliminar la vacunación #${vac.id_vaccination}?`,
                  );
                  if (!ok) return;
                  onDelete(vac.id_vaccination);
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

export default VaccinationTable;
