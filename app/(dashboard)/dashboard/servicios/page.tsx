"use client";

import { CirclePlus } from "lucide-react";

import { useEffect, useState } from "react";

import SectionHeader from "../_components/SectionHeader";
import ServiceTable from "./_components/ServiceTable";
import ServiceFormDialog from "./_components/ServiceFormDialog";

import {
  createService,
  deleteService,
  findAllServices,
  updateService,
} from "@/services/servicios/serviceService";
import type { CreateServiceRequest, ServiceItem } from "@/types/servicio";

const ServicesPage = () => {
  const [servicios, setServicios] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await findAllServices();
      setServicios(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar la lista de servicios.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadServices();
  }, []);

  const handleCreate = async (servicio: CreateServiceRequest) => {
    const createdService = await createService(servicio);
    setServicios((current) => [...current, createdService]);
  };

  const handleUpdate = async (id: number, servicio: CreateServiceRequest) => {
    const updatedService = await updateService(id, servicio);
    setServicios((current) =>
      current.map((item) => (item.idService === id ? updatedService : item)),
    );
  };

  const handleDelete = async (id: number) => {
    await deleteService(id);
    setServicios((current) => current.filter((item) => item.idService !== id));
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

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <ServiceTable
          servicios={servicios}
          loading={loading}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ServicesPage;
