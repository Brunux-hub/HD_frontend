"use client";

import { SquarePen } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ClientFormDialog from "../../_components/ClientFormDialog";

import { Cliente } from "@/types/cliente";

type Props = {
  cliente: Cliente;
  petCount: number;
  onUpdate: (data: Omit<Cliente, "id">) => void;
};

const ClientProfileCard = ({ cliente, petCount, onUpdate }: Props) => {
  return (
    <Card className="gap-4">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardDescription>
            Responsable de las mascotas registradas
          </CardDescription>
          <CardTitle className="text-xl">{cliente.nombre}</CardTitle>
        </div>
        <ClientFormDialog
          mode="edit"
          icon={SquarePen}
          buttonColor="alert"
          data={cliente}
          onSubmit={onUpdate}
        />
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <p className="text-xs text-muted-foreground">Telefono</p>
          <p className="font-medium">{cliente.telefono}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="font-medium">{cliente.email}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-muted-foreground">Direccion</p>
          <p className="font-medium">{cliente.direccion}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Mascotas registradas</p>
          <p className="font-medium">{petCount}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientProfileCard;
