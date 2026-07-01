"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../../_components/SectionHeader";
import ClientProfileCard from "./_components/ClientProfileCard";
import PetTable from "../../mascotas/_components/PetTable";
import PetFormDialog from "../../mascotas/_components/PetFormDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Owner, OwnerRequest } from "@/types/owner";
import { Mascota } from "@/types/mascota";
import { getOwnerById, updateOwner } from "@/services/owners/owners";
import {
  createMascota,
  deleteMascota,
  getMascotasByClienteId,
  updateMascota,
} from "@/services/mascotas/storage";

const ClientProfilePage = () => {
  const params = useParams<{ id: string }>();
  const ownerId = Number(params.id);

  const [owner, setOwner] = useState<Owner | null>(null);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Las mascotas siguen en almacenamiento local en esta parte;
  // se conectarán al backend (/pet) en la Parte 3.
  const loadPets = useCallback(() => {
    if (typeof window === "undefined" || !Number.isFinite(ownerId)) {
      setMascotas([]);
      return;
    }
    setMascotas(getMascotasByClienteId(ownerId));
  }, [ownerId]);

  const loadOwner = useCallback(async () => {
    if (!Number.isFinite(ownerId)) {
      setOwner(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setOwner(await getOwnerById(ownerId));
    } catch (err) {
      setOwner(null);
      setError(err instanceof Error ? err.message : "No se pudo cargar el cliente.");
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    loadOwner();
    loadPets();
  }, [loadOwner, loadPets]);

  const handleClientUpdate = async (data: OwnerRequest) => {
    await updateOwner(ownerId, data);
    await loadOwner();
  };

  const handleCreatePet = (data: Omit<Mascota, "id">) => {
    createMascota(data);
    loadPets();
  };

  const handleUpdatePet = (id: number, data: Omit<Mascota, "id">) => {
    updateMascota(id, data);
    loadPets();
  };

  const handleDeletePet = (id: number) => {
    deleteMascota(id);
    loadPets();
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-295 flex-col gap-6 px-4">
        <p className="text-sm text-muted-foreground">Cargando cliente...</p>
      </div>
    );
  }

  if (!Number.isFinite(ownerId) || !owner) {
    return (
      <div className="mx-auto flex max-w-295 flex-col gap-6 px-4">
        <SectionHeader
          iconName="Icono Clientes"
          iconLabel="Clientes"
          title="Cliente no encontrado"
          description="El registro solicitado no existe o fue eliminado."
          action={
            <Button asChild variant="outline">
              <Link href="/dashboard/clientes">Volver al listado</Link>
            </Button>
          }
        />
        <Card>
          <CardContent className="pt-2">
            {error ?? "Verifica el enlace o regresa al listado para seleccionar otro cliente."}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Clientes"
        iconLabel="Perfil del cliente"
        title={`${owner.names} ${owner.last_names}`}
        description="Gestiona los datos del cliente y el registro de sus mascotas."
        action={
          <PetFormDialog
            clienteId={owner.id_owner}
            mode="create"
            icon={CirclePlus}
            buttonColor="success"
            onSubmit={handleCreatePet}
          />
        }
      />

      <ClientProfileCard
        owner={owner}
        petCount={mascotas.length}
        onUpdate={handleClientUpdate}
      />

      <PetTable
        mascotas={mascotas}
        caption="Mascotas registradas para este cliente"
        onEdit={handleUpdatePet}
        onDelete={handleDeletePet}
      />
    </div>
  );
};

export default ClientProfilePage;
