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

import { Owner, OwnerRequest } from "@/types/owner";

type Props = {
  owner: Owner;
  petCount: number;
  onUpdate: (data: OwnerRequest) => Promise<void> | void;
};

const ClientProfileCard = ({ owner, petCount, onUpdate }: Props) => {
  return (
    <Card className="gap-4">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardDescription>
            Responsable de las mascotas registradas
          </CardDescription>
          <CardTitle className="text-xl">
            {owner.names} {owner.last_names}
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
          <p className="text-xs text-muted-foreground">Teléfono</p>
          <p className="font-medium">{owner.phone_number}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="font-medium">{owner.email}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-muted-foreground">Dirección</p>
          <p className="font-medium">{owner.address}</p>
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
