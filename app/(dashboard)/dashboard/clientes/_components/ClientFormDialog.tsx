"use client";

import { useState } from "react";
import { LucideIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Cliente } from "@/types/cliente";

type Props = {
  mode?: "create" | "edit";
  data?: Cliente;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: Omit<Cliente, "id">) => void;
};

const ClientFormDialog = ({
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const clientData: Omit<Cliente, "id"> = {
      nombre: formData.get("nombre") as string,
      telefono: formData.get("telefono") as string,
      email: formData.get("email") as string,
      direccion: formData.get("direccion") as string,
    };

    onSubmit(clientData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonColor}>{Icon && <Icon />}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only" />
        <DialogDescription className="sr-only" />
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="text-center text-xl font-semibold">
                {mode === "create" ? "Crear Cliente" : "Modificar Cliente"}
              </FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="input-nombre">Nombre</FieldLabel>
                  <Input
                    id="input-nombre"
                    name="nombre"
                    defaultValue={data?.nombre ?? ""}
                    placeholder="Ej. Juan Perez"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-telefono">Telefono</FieldLabel>
                  <Input
                    id="input-telefono"
                    name="telefono"
                    defaultValue={data?.telefono ?? ""}
                    placeholder="Ej. 987654321"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-email">Email</FieldLabel>
                  <Input
                    id="input-email"
                    name="email"
                    type="email"
                    defaultValue={data?.email ?? ""}
                    placeholder="cliente@email.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-direccion">Direccion</FieldLabel>
                  <Input
                    id="input-direccion"
                    name="direccion"
                    defaultValue={data?.direccion ?? ""}
                    placeholder="Av. Principal 123"
                    required
                  />
                </Field>
                <Field
                  orientation="horizontal"
                  className="justify-center gap-4"
                >
                  <Button type="submit">Guardar</Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormDialog;
