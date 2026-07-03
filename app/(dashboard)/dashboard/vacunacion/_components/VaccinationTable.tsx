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

import VaccinationFormDialog from "./VaccinationFormDialog";

import { Vaccination, VaccinationRequest } from "@/types/vaccination";
import { MedicalHistory } from "@/types/medicalHistory";
import { Vaccine } from "@/types/vaccine";

type Props = {
  vaccinations: Vaccination[];
  medicalHistories: MedicalHistory[];
  vaccines: Vaccine[];
  onEdit: (id: number, vaccination: VaccinationRequest) => void;
  onDelete: (id: number) => void;
};

const VaccinationTable = ({
  vaccinations,
  medicalHistories,
  vaccines,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Vacuna</TableHead>
          <TableHead>Historial</TableHead>
          <TableHead>Aplicación</TableHead>
          <TableHead>Próxima</TableHead>
          <TableHead>Observación</TableHead>
          <TableHead className="w-25"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vaccinations.map((vac) => (
          <TableRow key={vac.id_vaccination}>
            <TableCell className="font-medium">{vac.id_vaccination}</TableCell>
            <TableCell>{vac.vaccine?.name}</TableCell>
            <TableCell>#{vac.medical_history?.id_medical_history}</TableCell>
            <TableCell>{vac.application_date?.slice(0, 10)}</TableCell>
            <TableCell>{vac.next_application_date?.slice(0, 10)}</TableCell>
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
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7} className="h-5 text-center"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default VaccinationTable;
