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

import VaccineFormDialog from "./VaccineFormDialog";

import { Vaccine, VaccineRequest } from "@/types/vaccine";

type Props = {
  vaccines: Vaccine[];
  onEdit?: (id: number, vaccine: VaccineRequest) => void;
};

const VaccineTable = ({ vaccines, onEdit }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Fabricante</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Dosis</TableHead>
          <TableHead className="w-25"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vaccines.map((vaccine) => (
          <TableRow key={vaccine.id_vaccine}>
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

export default VaccineTable;
