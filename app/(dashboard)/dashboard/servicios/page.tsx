"use client";

import { CirclePlus } from "lucide-react";

import { useEffect, useState } from "react";

import SectionHeader from "../_components/SectionHeader";
import ServiceTable from "./_components/ServiceTable";
import ServiceFormDialog from "./_components/ServiceFormDialog";

import { Servicio } from "@/types/servicio";

import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
} from "@/services/servicios/storage";

const ServicesPage = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);

  useEffect(() => {
    setServicios(getServicios());
  }, []);

  const handleCreate = (servicio: Omit<Servicio, "id">) => {
    const updated = createServicio(servicio);
    setServicios(updated);
  };

  const handleUpdate = (id: number, servicio: Omit<Servicio, "id">) => {
    const updated = updateServicio(id, servicio);
    setServicios(updated);
  };

  const handleDelete = (id: number) => {
    const updated = deleteServicio(id);
    setServicios(updated);
  };

  return (
    <div className="max-w-295 px-4 mx-auto border flex flex-col gap-8 border-amber-500">
      <SectionHeader
        iconName="Icono Servicios"
        iconLabel="Servicios"
        title="Listado de Servicios"
        description="Vista donde podrás revisar y gestionar los servicios"
        action={
          <ServiceFormDialog
            mode="create"
            icon={CirclePlus}
            buttonColor="success"
            onSubmit={handleCreate}
          />
        }
      />

      {/* TABLA DE SERVICIOS */}
      <ServiceTable
        servicios={servicios}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ServicesPage;
