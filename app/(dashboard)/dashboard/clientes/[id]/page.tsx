"use client";

import { useEffect, useState } from "react";
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
  const clientId = Number(params.id);

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (!Number.isFinite(clientId)) {
        setIsReady(true);
        return;
      }

      setCliente(getClienteById(clientId) ?? null);
      setMascotas(getMascotasByClienteId(clientId));
      setIsReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [clientId]);

  const handleClientUpdate = (data: Omit<Cliente, "id">) => {
    updateCliente(clientId, data);
    setCliente(getClienteById(clientId) ?? null);
  };

  const handleCreatePet = (data: Omit<Mascota, "id">) => {
    createMascota(data);
    setMascotas(getMascotasByClienteId(clientId));
  };

  const handleUpdatePet = (id: number, data: Omit<Mascota, "id">) => {
    updateMascota(id, data);
    setMascotas(getMascotasByClienteId(clientId));
  };

  const handleDeletePet = (id: number) => {
    deleteMascota(id);
    setMascotas(getMascotasByClienteId(clientId));
  };

  if (isReady && !cliente) {
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

  if (!cliente) {
    return null;
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
