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
import { CreatePetRequest, PetItem } from "@/types/mascota";
import { getOwnerById, updateOwner } from "@/services/owners/owners";
import {
  createPet,
  deletePet,
  findAllPets,
  updatePet,
} from "@/services/mascotas/petService";

const ClientProfilePage = () => {
  const params = useParams<{ id: string }>();
  const ownerId = Number(params.id);

  const [owner, setOwner] = useState<Owner | null>(null);
  const [mascotas, setMascotas] = useState<PetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPets = useCallback(async () => {
    if (!Number.isFinite(ownerId)) {
      setMascotas([]);
      return;
    }
    try {
      const pets = await findAllPets();
      setMascotas(pets.filter((pet) => pet.owner.idOwner === ownerId));
    } catch {
      setMascotas([]);
    }
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
    void loadOwner();
    void loadPets();
  }, [loadOwner, loadPets]);

  const handleClientUpdate = async (data: OwnerRequest) => {
    await updateOwner(ownerId, data);
    await loadOwner();
  };

  const handleCreatePet = async (data: CreatePetRequest) => {
    await createPet(data);
    await loadPets();
  };

  const handleUpdatePet = async (id: number, data: CreatePetRequest) => {
    await updatePet(id, data);
    await loadPets();
  };

  const handleDeletePet = async (id: number) => {
    await deletePet(id);
    await loadPets();
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
        title={`${owner.names} ${owner.lastNames}`}
        description="Gestiona los datos del cliente y el registro de sus mascotas."
        action={
          <PetFormDialog
            ownerId={owner.idOwner}
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
