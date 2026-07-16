"use client";

import { SquarePen } from "lucide-react";
import { AnimatedFrame } from "@/components/ui/animated-frame";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ClientFormDialog from "../../_components/ClientFormDialog";

import { ClienteResponse, ClienteRequest } from "@/types/cliente";

type Props = {
  owner: ClienteResponse;
  petCount: number;
  onUpdate: (data: ClienteRequest) => Promise<void> | void;
};

const ClientProfileCard = ({ owner, petCount, onUpdate }: Props) => {
  return (
    <Card className="gap-4 relative">
      <AnimatedFrame radius={16}>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardDescription>
            Responsable de las mascotas registradas
          </CardDescription>
          <CardTitle className="text-xl">
            {owner.nombres} {owner.apellidos}
          </CardTitle>
        </div>
        <ClientFormDialog
          mode="edit"
          icon={SquarePen}
          buttonColor="alert"
          data={owner}
          onSubmit={onUpdate}
        />
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <p className="text-xs text-muted-foreground">DNI</p>
          <p className="font-medium">{owner.dni}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Teléfono</p>
          <p className="font-medium">{owner.telefono}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Correo</p>
          <p className="font-medium">{owner.usuario.correo}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-muted-foreground">Dirección</p>
          <p className="font-medium">{owner.direccion}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Mascotas registradas</p>
          <p className="font-medium">{petCount}</p>
        </div>
      </CardContent>
      </AnimatedFrame>
    </Card>
  );
};

export default ClientProfileCard;
