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

import { Owner, OwnerRequest } from "@/types/owner";

type Props = {
  mode?: "create" | "edit";
  data?: Owner;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: OwnerRequest) => Promise<void> | void;
};

const ClientFormDialog = ({
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload: OwnerRequest = {
      names: formData.get("names") as string,
      last_names: formData.get("last_names") as string,
      email: formData.get("email") as string,
      phone_number: formData.get("phone_number") as string,
      address: formData.get("address") as string,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el cliente.");
    } finally {
      setSubmitting(false);
    }
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
                  <FieldLabel htmlFor="input-names">Nombres</FieldLabel>
                  <Input
                    id="input-names"
                    name="names"
                    defaultValue={data?.names ?? ""}
                    placeholder="Ej. Juan Carlos"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-last-names">Apellidos</FieldLabel>
                  <Input
                    id="input-last-names"
                    name="last_names"
                    defaultValue={data?.last_names ?? ""}
                    placeholder="Ej. Pérez García"
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
                  <FieldLabel htmlFor="input-phone">Teléfono</FieldLabel>
                  <Input
                    id="input-phone"
                    name="phone_number"
                    defaultValue={data?.phone_number ?? ""}
                    placeholder="Ej. 987654321"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-address">Dirección</FieldLabel>
                  <Input
                    id="input-address"
                    name="address"
                    defaultValue={data?.address ?? ""}
                    placeholder="Av. Principal 123"
                    required
                  />
                </Field>

                {error && (
                  <p className="text-center text-sm font-medium text-destructive">
                    {error}
                  </p>
                )}

                <Field orientation="horizontal" className="justify-center gap-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Guardando..." : "Guardar"}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={submitting}
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
