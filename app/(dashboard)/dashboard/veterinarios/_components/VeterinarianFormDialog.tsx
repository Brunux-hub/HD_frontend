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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { UserItem } from "@/types/user";
import type {
  CreateVeterinarianRequest,
  VeterinarianItem,
} from "@/types/veterinario";

type Props = {
  users: UserItem[];
  mode?: "create" | "edit";
  data?: VeterinarianItem;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: CreateVeterinarianRequest) => Promise<void>;
};

const VeterinarianFormDialog = ({
  users,
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  const availableUsers = users.filter((user) => typeof user.id_user === "number");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState(
    String(data?.userResponse.idUser ?? ""),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload: CreateVeterinarianRequest = {
      idUser: Number(selectedUserId),
      names: String(formData.get("names") ?? ""),
      lastNames: String(formData.get("lastNames") ?? ""),
      numberLicense: String(formData.get("numberLicense") ?? ""),
      specialty: String(formData.get("specialty") ?? ""),
      email: String(formData.get("email") ?? ""),
      phoneNumber: String(formData.get("phoneNumber") ?? ""),
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar el veterinario.",
      );
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
                {mode === "create" ? "Crear Veterinario" : "Modificar Veterinario"}
              </FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="select-user">Usuario asociado</FieldLabel>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger id="select-user">
                      <SelectValue placeholder="Selecciona un usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {availableUsers.map((user) => (
                          <SelectItem key={user.id_user} value={String(user.id_user)}>
                            {user.username} ({user.type})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-names">Nombres</FieldLabel>
                  <Input
                    id="input-names"
                    name="names"
                    defaultValue={data?.names ?? ""}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-last-names">Apellidos</FieldLabel>
                  <Input
                    id="input-last-names"
                    name="lastNames"
                    defaultValue={data?.lastNames ?? ""}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-license">Nro. colegiatura</FieldLabel>
                  <Input
                    id="input-license"
                    name="numberLicense"
                    defaultValue={data?.numberLicense ?? ""}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-specialty">Especialidad</FieldLabel>
                  <Input
                    id="input-specialty"
                    name="specialty"
                    defaultValue={data?.specialty ?? ""}
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
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-phone">Teléfono</FieldLabel>
                  <Input
                    id="input-phone"
                    name="phoneNumber"
                    defaultValue={data?.phoneNumber ?? ""}
                    required
                  />
                </Field>
                {error ? (
                  <p className="text-sm text-red-600">{error}</p>
                ) : null}
                <Field orientation="horizontal" className="justify-center gap-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Guardando..." : "Guardar"}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={submitting}
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

export default VeterinarianFormDialog;
