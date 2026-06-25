"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../../_components/SectionHeader";
import ClientProfileCard from "./_components/ClientProfileCard";
import PetTable from "../../mascotas/_components/PetTable";
import PetFormDialog from "../../mascotas/_components/PetFormDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Cliente } from "@/types/cliente";
import { Mascota } from "@/types/mascota";
import { getClienteById, updateCliente } from "@/services/clientes/storage";
import {
  createMascota,
  deleteMascota,
  getMascotasByClienteId,
  updateMascota,
} from "@/services/mascotas/storage";

const ClientProfilePage = () => {
  const params = useParams<{ id: string }>();
  const clientId = Number(params?.id);
  const [cliente, setCliente] = useState<Cliente | null>(() => {
    if (typeof window === "undefined" || !Number.isFinite(clientId)) {
      return null;
    }

    return getClienteById(clientId) ?? null;
  });
  const [mascotas, setMascotas] = useState<Mascota[]>(() => {
    if (typeof window === "undefined" || !Number.isFinite(clientId)) {
      return [];
    }

    return getMascotasByClienteId(clientId);
  });

  const loadData = () => {
    if (typeof window === "undefined" || !Number.isFinite(clientId)) {
      setCliente(null);
      setMascotas([]);
      return;
    }

    setCliente(getClienteById(clientId) ?? null);
    setMascotas(getMascotasByClienteId(clientId));
  };

  const handleClientUpdate = (data: Omit<Cliente, "id">) => {
    updateCliente(clientId, data);
    loadData();
  };

  const handleCreatePet = (data: Omit<Mascota, "id">) => {
    createMascota(data);
    loadData();
  };

  const handleUpdatePet = (id: number, data: Omit<Mascota, "id">) => {
    updateMascota(id, data);
    loadData();
  };

  const handleDeletePet = (id: number) => {
    deleteMascota(id);
    loadData();
  };

  if (!Number.isFinite(clientId) || !cliente) {
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
            Verifica el enlace o regresa al listado para seleccionar otro
            cliente.
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
        title={cliente.nombre}
        description="Gestiona los datos del cliente y el registro de sus mascotas."
        action={
          <PetFormDialog
            clienteId={cliente.id}
            mode="create"
            icon={CirclePlus}
            buttonColor="success"
            onSubmit={handleCreatePet}
          />
        }
      />

      <ClientProfileCard
        cliente={cliente}
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
