"use client";

import { useCallback, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import ReceptionistTable from "./_components/ReceptionistTable";
import ReceptionistFormDialog from "./_components/ReceptionistFormDialog";

import { Receptionist, ReceptionistRequest } from "@/types/receptionist";
import {
  getReceptionists,
  createReceptionist,
  updateReceptionist,
  deleteReceptionist,
} from "@/services/receptionists/receptionists";

const ReceptionistsPage = () => {
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const receptionistsData = await getReceptionists();
      setReceptionists(receptionistsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los recepcionistas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data: ReceptionistRequest) => {
    await createReceptionist(data);
    await load();
  };

  const handleUpdate = async (id: number, data: ReceptionistRequest) => {
    await updateReceptionist(id, data);
    await load();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReceptionist(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el recepcionista.");
    }
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Usuarios"
        iconLabel="Recepcionistas"
        title="Listado de recepcionistas"
        description="Vista donde podrás revisar y gestionar al personal de recepción."
        accent="teal"
      />

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex">
        <ReceptionistFormDialog
          mode="create"
          icon={CirclePlus}
          buttonColor="success"
          onSubmit={handleCreate}
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando recepcionistas...</p>
      ) : (
        <ReceptionistTable
          receptionists={receptionists}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ReceptionistsPage;
