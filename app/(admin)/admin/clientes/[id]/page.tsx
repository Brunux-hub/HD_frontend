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

import { ClienteResponse, ClienteRequest } from "@/types/cliente";
import { Pet, PetRequest } from "@/types/pet";
import { getOwnerById, updateOwner } from "@/services/owners/owners";
import {
  createPet,
  getPetsByOwner,
  updatePet,
  activatePet,
  deactivatePet,
} from "@/services/pets/pets";

const ClientProfilePage = () => {
  const params = useParams<{ id: string }>();
  const ownerId = Number(params.id);

  const [owner, setOwner] = useState<ClienteResponse | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPets = useCallback(async () => {
    if (!Number.isFinite(ownerId)) {
      setPets([]);
      return;
    }
    try {
      setPets(await getPetsByOwner(ownerId));
    } catch {
      setPets([]);
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
    loadOwner();
    loadPets();
  }, [loadOwner, loadPets]);

  const handleClientUpdate = async (data: ClienteRequest) => {
    await updateOwner(ownerId, data);
    await loadOwner();
  };

  const handleCreatePet = async (data: PetRequest) => {
    await createPet(data);
    await loadPets();
  };

  const handleUpdatePet = async (id: number, data: PetRequest) => {
    await updatePet(id, data);
    await loadPets();
  };

  const handleActivatePet = async (id: number) => {
    await activatePet(id);
    await loadPets();
  };

  const handleDeactivatePet = async (id: number) => {
    await deactivatePet(id);
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
          accent="teal"
          action={
            <Button asChild variant="outline">
              <Link href="/admin/clientes">Volver al listado</Link>
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
        title="Perfil del cliente"
        description="Gestiona los datos del cliente y el registro de sus mascotas."
        accent="teal"
      />

      <ClientProfileCard
        owner={owner}
        petCount={pets.length}
        onUpdate={handleClientUpdate}
      />

      <div className="flex">
        <PetFormDialog
          ownerId={owner.idUsuario}
          mode="create"
          icon={CirclePlus}
          buttonColor="success"
          onSubmit={handleCreatePet}
        />
      </div>

      <PetTable
        pets={pets}
        onEdit={handleUpdatePet}
        onActivate={handleActivatePet}
        onDeactivate={handleDeactivatePet}
      />
    </div>
  );
};

export default ClientProfilePage;
