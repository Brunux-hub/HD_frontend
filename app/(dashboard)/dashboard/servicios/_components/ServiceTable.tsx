"use client";

import { SquarePen, Trash } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import ServiceFormDialog from "./ServiceFormDialog";

// Contratos de Dominio
import { Servicio } from "@/types/servicio";

type Props = {
  servicios: Servicio[];
  onEdit: (id: number, servicio: Omit<Servicio, "id">) => void;
  onDelete: (id: number) => void;
};

const ServiceTable = ({ servicios, onEdit, onDelete }: Props) => {
  return (
    <Table>
      <TableCaption>Lista de Servicios Veterinarios</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="w-25"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {servicios.map((servicio) => (
          <TableRow key={servicio.id}>
            <TableCell className="font-medium">{servicio.id}</TableCell>
            <TableCell>{servicio.nombre}</TableCell>
            <TableCell>{servicio.categoria}</TableCell>
            <TableCell>{servicio.descripcion}</TableCell>
            <TableCell>{servicio.precio}</TableCell>
            <TableCell>{servicio.estado ? "Activo" : "Inactivo"}</TableCell>
            <TableCell className="flex justify-between">
              {/* Dialog editar*/}
              <ServiceFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                data={servicio}
                onSubmit={(data) => onEdit(servicio.id, data)}
              />
              {/* Botón eliminar */}
              <Button
                variant="destructive"
                onClick={() => {
                  const confirmar = window.confirm(
                    `¿Seguro que deseas eliminar el servicio "${servicio.nombre}"?`,
                  );

                  if (!confirmar) return;

                  onDelete(servicio.id);
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
          <TableCell colSpan={7} className="text-center h-5"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ServiceTable;
