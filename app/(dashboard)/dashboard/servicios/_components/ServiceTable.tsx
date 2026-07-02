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

import { Button } from "@/components/ui/button";

import ServiceFormDialog from "./ServiceFormDialog";

import type { CreateServiceRequest, ServiceItem } from "@/types/servicio";

type Props = {
  servicios: ServiceItem[];
  loading?: boolean;
  onEdit: (id: number, servicio: CreateServiceRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const ServiceTable = ({ servicios, loading = false, onEdit, onDelete }: Props) => {
  return (
    <Table>
      <TableCaption>Lista de Servicios Veterinarios</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Cargando servicios...
            </TableCell>
          </TableRow>
        ) : servicios.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No hay servicios para mostrar.
            </TableCell>
          </TableRow>
        ) : (
          servicios.map((servicio, index) => (
            <TableRow key={`${servicio.idService}-${servicio.name}-${index}`}>
              <TableCell className="font-medium">{servicio.idService}</TableCell>
              <TableCell>{servicio.name}</TableCell>
              <TableCell>{servicio.description}</TableCell>
              <TableCell>{servicio.price}</TableCell>
              <TableCell className="flex justify-between">
                <ServiceFormDialog
                  icon={SquarePen}
                  mode="edit"
                  buttonColor="alert"
                  data={servicio}
                  onSubmit={async (data) => {
                    if (typeof servicio.idService !== "number") {
                      throw new Error("El servicio no tiene un idService válido para editar.");
                    }

                    await onEdit(servicio.idService, data);
                  }}
                />
                <Button
                  variant="destructive"
                  disabled={typeof servicio.idService !== "number"}
                  onClick={async () => {
                    if (typeof servicio.idService !== "number") {
                      return;
                    }

                    const confirmar = window.confirm(
                      `¿Seguro que deseas eliminar el servicio "${servicio.name}"?`,
                    );

                    if (!confirmar) return;

                    await onDelete(servicio.idService);
                  }}
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5} className="text-center h-5"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ServiceTable;
