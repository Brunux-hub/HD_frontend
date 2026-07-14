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

const MedicalHistoryTable = ({
  medicalHistories,
  appointments,
  services,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cita</TableHead>
          <TableHead>Servicio</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead className="w-25"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medicalHistories.map((mh) => (
          <TableRow key={mh.id_medical_history}>
            <TableCell>
              {`#${mh.appointment?.id_appointment} ${mh.appointment?.pet?.name}`}
            </TableCell>
            <TableCell>{mh.services?.name}</TableCell>
            <TableCell>{mh.description}</TableCell>
            <TableCell>{mh.date?.slice(0, 16).replace("T", " ")}</TableCell>
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
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6} className="h-5 text-center"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default MedicalHistoryTable;
