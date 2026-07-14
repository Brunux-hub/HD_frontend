"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import ServiceTable from "./_components/ServiceTable";
import ServiceFormDialog from "./_components/ServiceFormDialog";

import { Service, ServiceRequest } from "@/types/service";
import {
  getServices,
  createService,
  updateService,
  activateService,
  deactivateService,
} from "@/services/services/services";

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setServices(await getServices());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los servicios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data: ServiceRequest) => {
    await createService(data);
    await load();
  };

  const handleUpdate = async (id: number, data: ServiceRequest) => {
    await updateService(id, data);
    await load();
  };

  const handleActivate = async (id: number) => {
    await activateService(id);
    await load();
  };

  const handleDeactivate = async (id: number) => {
    await deactivateService(id);
    await load();
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Servicios"
        iconLabel="Servicios"
        title="Listado de Servicios"
        description="Vista donde podrás revisar y gestionar los servicios."
        accent="teal"
      />

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex">
        <ServiceFormDialog
          mode="create"
          icon={CirclePlus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando servicios...</p>
      ) : (
        <ServiceTable
          services={services}
          onEdit={handleUpdate}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
        />
      )}
    </div>
  );
};

export default ServicesPage;
