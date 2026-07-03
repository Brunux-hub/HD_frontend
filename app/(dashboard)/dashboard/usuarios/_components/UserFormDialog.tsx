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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { User, UserRequest } from "@/types/user";
import type { UserType } from "@/types/enums";

type Props = {
  mode?: "create" | "edit";
  data?: User;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: UserRequest) => Promise<void> | void;
};

const UserFormDialog = ({ mode, data, icon: Icon, buttonColor, onSubmit }: Props) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<UserType>(data?.type ?? "WORKER");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload: UserRequest = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      type,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el usuario.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={mode === "create" ? "teal" : buttonColor}>{Icon && <Icon />}{mode === "create" && "Agregar"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only" />
        <DialogDescription className="sr-only" />
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="text-center text-xl font-semibold">
                {mode === "create" ? "Crear Usuario" : "Modificar Usuario"}
              </FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="input-username">Usuario</FieldLabel>
                  <Input
                    id="input-username"
                    name="username"
                    defaultValue={data?.username ?? ""}
                    placeholder="ej. jperez"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-password">Contraseña</FieldLabel>
                  <Input
                    id="input-password"
                    name="password"
                    type="password"
                    placeholder="********"
                    required
                  />
                  {mode === "edit" && (
                    <p className="text-xs text-muted-foreground">
                      Al guardar se actualizará la contraseña.
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="select-type">Tipo de usuario</FieldLabel>
                  <Select value={type} onValueChange={(v) => setType(v as UserType)}>
                    <input type="hidden" name="type" value={type} />
                    <SelectTrigger id="select-type">
                      <SelectValue placeholder="Elige un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ADMIN">Administrador (ADMIN)</SelectItem>
                        <SelectItem value="WORKER">Trabajador (WORKER)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {error && (
                  <p className="text-center text-sm font-medium text-destructive">{error}</p>
                )}

                <Field orientation="horizontal" className="justify-center gap-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Guardando..." : "Guardar"}
                  </Button>
                  <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={submitting}>
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

export default UserFormDialog;
