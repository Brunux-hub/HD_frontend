"use client";

import { SquarePen } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import MedicalHistoryFormDialog from "./MedicalHistoryFormDialog";

import { MedicalHistory, MedicalHistoryRequest } from "@/types/medicalHistory";
import { Appointment } from "@/types/appointment";
import { Service } from "@/types/service";
import { Pet } from "@/types/pet";

type Props = {
  medicalHistories: MedicalHistory[];
  appointments: Appointment[];
  pets: Pet[];
  services: Service[];
  onEdit: (id: number, medicalHistory: MedicalHistoryRequest) => void;
};

const MedicalHistoryTable = ({
  medicalHistories,
  appointments,
  pets,
  services,
  onEdit,
}: Props) => {
  const petMap = new Map(pets.map((p) => [p.idMascota, p]));
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
              {`#${mh.appointment?.idCita} ${petMap.get(mh.appointment?.idMascota ?? 0)?.nombre ?? "—"}`}
            </TableCell>
            <TableCell>{mh.services?.nombre}</TableCell>
            <TableCell>{mh.description}</TableCell>
            <TableCell>{mh.date?.slice(0, 16).replace("T", " ")}</TableCell>
            <TableCell className="flex justify-between gap-2">
              <MedicalHistoryFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                data={mh}
                appointments={appointments}
                pets={pets}
                services={services}
                onSubmit={(payload) => onEdit(mh.id_medical_history, payload)}
              />

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
