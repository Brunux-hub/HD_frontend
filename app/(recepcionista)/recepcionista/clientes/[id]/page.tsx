"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CirclePlus } from "lucide-react";

import ClientProfileCard from "@/app/(admin)/admin/clientes/[id]/_components/ClientProfileCard";
import PetTable from "@/app/(admin)/admin/mascotas/_components/PetTable";
import PetFormDialog from "@/app/(admin)/admin/mascotas/_components/PetFormDialog";
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

const RecepcionistaClientProfilePage = () => {
  const params = useParams<{ id: string }>();
  const ownerId = Number(params?.id);

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
        <div className="flex items-center gap-4">
          <Link href="/recepcionista/clientes" className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Volver al listado
          </Link>
        </div>
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
      <div className="flex items-center gap-4">
        <Link href="/recepcionista/clientes" className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {owner.nombres} {owner.apellidos}
          </h1>
          <p className="text-sm text-slate-500">Perfil del cliente</p>
        </div>
      </div>

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

export default RecepcionistaClientProfilePage;
