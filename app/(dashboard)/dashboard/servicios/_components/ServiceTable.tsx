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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
// Componentes Propios
import TableButton from "./TableButton";

import ServiceForm from "./ServiceForm";

// Contratos de Dominio
import { Servicio } from "@/types/servicio";

// RAW Data (servicios)
const servicios: Servicio[] = [
  {
    id: 1,
    nombre: "Consulta Veterinaria General",
    categoria: "consulta",
    descripcion: "Revisión integral de salud y diagnóstico inicial.",
    precio: 45.0,
    estado: true,
  },
  {
    id: 2,
    nombre: "Corte y Baño Premium",
    categoria: "grooming",
    descripcion:
      "Servicio completo de estética, incluye corte de uñas y limpieza de oídos.",
    precio: 35.5,
    estado: true,
  },
  {
    id: 3,
    nombre: "Esterilización",
    categoria: "cirugia",
    descripcion: "Procedimiento quirúrgico con monitoreo anestésico completo.",
    precio: 120.0,
    estado: true,
  },
  {
    id: 4,
    nombre: "Vacunación Anual",
    categoria: "consulta",
    descripcion: "Refuerzo de vacunas polivalente y rabia.",
    precio: 25.0,
    estado: true,
  },
  {
    id: 5,
    nombre: "Limpieza Dental Ultrasónica",
    categoria: "cirugia",
    descripcion: "Eliminación de sarro bajo sedación profunda.",
    precio: 85.0,
    estado: false,
  },
];

const ServiceTable = () => {
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
          <TableHead></TableHead>
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
              {/* boton editar*/}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="alert">
                    <SquarePen />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle></DialogTitle>
                  {/*Formulario */}
                  <ServiceForm />
                </DialogContent>
              </Dialog>
              {/* boton eliminar */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle></DialogTitle>
                  {/*Formulario */}
                  Eliminar Registro XD
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7} className="text-center">
            N° Servicios
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ServiceTable;
