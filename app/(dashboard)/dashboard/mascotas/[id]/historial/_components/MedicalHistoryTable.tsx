"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { MedicalHistoryItem } from "@/types/medicalHistory";

type Props = {
  records: MedicalHistoryItem[];
  caption?: string;
};

const MedicalHistoryTable = ({
  records,
  caption = "Historial Clínico",
}: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"></TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Servicio</TableHead>
          <TableHead>Veterinario</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.idMedicalHistory}>
            <TableCell>
              <button
                type="button"
                onClick={() => toggleExpand(record.idMedicalHistory)}
                className="cursor-pointer"
                aria-label="Expandir fila"
              >
                {expandedId === record.idMedicalHistory ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </TableCell>
            <TableCell>{record.date.slice(0, 10)}</TableCell>
            <TableCell>{record.description}</TableCell>
            <TableCell>{record.services.name}</TableCell>
            <TableCell>{record.appointment.veterinarianName}</TableCell>
          </TableRow>
        ))}
        {records.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No hay registros de historial clínico.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MedicalHistoryTable;
