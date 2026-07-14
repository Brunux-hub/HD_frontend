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

import ServiceFormDialog from "./ServiceFormDialog";

import { Service, ServiceRequest } from "@/types/service";

type Props = {
  services: Service[];
  onEdit?: (id: number, service: ServiceRequest) => void;
};

const ServiceTable = ({ services, onEdit }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead className="w-25"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id_service}>
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

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5} className="h-5 text-center"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ServiceTable;
