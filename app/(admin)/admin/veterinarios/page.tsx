"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Veterinarian, VeterinarianRequest } from "@/types/veterinarian";
import {
  getVeterinarians,
  createVeterinarian,
  updateVeterinarian,
} from "@/services/veterinarians/veterinarians";
import { activateUser, deactivateUser } from "@/services/users/users";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import VetTable from "./_components/VetTable";
import VetFormDialog from "./_components/VetFormDialog";

const VeterinariansPage = () => {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setVeterinarians(await getVeterinarians());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los veterinarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data: VeterinarianRequest) => {
    await createVeterinarian(data);
    await load();
  };

  const handleUpdate = async (id: number, data: VeterinarianRequest) => {
    await updateVeterinarian(id, data);
    await load();
  };

  const handleActivate = async (id: number) => {
    await activateUser(id);
    await load();
  };

  const handleDeactivate = async (id: number) => {
    await deactivateUser(id);
    await load();
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Veterinarios</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestiona el personal veterinario.</p>
        </div>
        <VetFormDialog
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
        <TableSkeleton columns={5} rows={6} />
      ) : (
        <VetTable veterinarians={veterinarians} onEdit={handleUpdate} onActivate={handleActivate} onDeactivate={handleDeactivate} />
      )}
    </div>
  );
};

export default VeterinariansPage;
