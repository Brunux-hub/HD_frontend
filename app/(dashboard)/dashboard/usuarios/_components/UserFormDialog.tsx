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

import { USER_TYPES } from "@/types/enums";
import type { CreateUserRequest, UserItem } from "@/types/user";

type Props = {
  mode?: "create" | "edit";
  data?: UserItem;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: CreateUserRequest) => Promise<void>;
};

const UserFormDialog = ({
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(data?.type ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload: CreateUserRequest = {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
      type: String(formData.get("type") ?? "") as CreateUserRequest["type"],
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
      setOpen(false);
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
              <FieldLegend className="text-center font-semibold text-xl">
                {mode === "create" ? "Crear Usuario" : "Modificar Usuario"}
              </FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="input-username">Username</FieldLabel>
                  <Input
                    id="input-username"
                    name="username"
                    defaultValue={data?.username ?? ""}
                    placeholder="ej. luisma"
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
                </Field>
                <Field>
                  <FieldLabel htmlFor="select-type">Tipo de usuario</FieldLabel>
                  <Select value={type} onValueChange={setType}>
                    <input type="hidden" name="type" value={type} />
                    <SelectTrigger id="select-type">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {USER_TYPES.map((userType) => (
                          <SelectItem key={userType} value={userType}>
                            {userType}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
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

export default UserFormDialog;

