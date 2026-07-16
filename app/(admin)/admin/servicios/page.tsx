"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Service, ServiceRequest } from "@/types/service";
import {
  getServices,
  createService,
  updateService,
  activateService,
  deactivateService,
} from "@/services/services/services";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import ServiceTable from "./_components/ServiceTable";
import ServiceFormDialog from "./_components/ServiceFormDialog";

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
    <div className="mx-auto flex max-w-295 flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Servicios</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestiona los servicios ofrecidos.</p>
        </div>
        <ServiceFormDialog
          mode="create"
          icon={Plus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <TableSkeleton columns={4} rows={6} />
      ) : (
        <ServiceTable services={services} onEdit={handleUpdate} onActivate={handleActivate} onDeactivate={handleDeactivate} />
      )}
    </div>
  );
};

export default ServicesPage;
