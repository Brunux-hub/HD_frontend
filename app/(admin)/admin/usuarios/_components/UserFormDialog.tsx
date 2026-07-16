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

type Props = {
  mode?: "create" | "edit";
  data?: User;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: UserRequest | { contraseniaActual: string; nuevaContrasenia: string }) => Promise<void> | void;
};

const UserFormDialog = ({ mode, data, icon: Icon, buttonColor, open: externalOpen, onOpenChange: externalOnOpenChange, onSubmit }: Props) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen ?? internalOpen;
  const setOpen = externalOnOpenChange ?? setInternalOpen;
  const [rol, setRol] = useState(data?.rol ?? "WORKER");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    if (mode === "create") {
      const payload: UserRequest = {
        correo: formData.get("correo") as string,
        contrasenia: formData.get("contrasenia") as string,
        rol,
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
    } else {
      const payload = {
        contraseniaActual: formData.get("contraseniaActual") as string,
        nuevaContrasenia: formData.get("nuevaContrasenia") as string,
      };
      setSubmitting(true);
      try {
        await onSubmit(payload);
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant={mode === "create" ? "teal" : buttonColor}>{Icon && <Icon />}{mode === "create" && "Agregar"}</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogTitle className="sr-only" />
        <DialogDescription className="sr-only" />
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="text-center text-xl font-semibold">
                {mode === "create" ? "Crear Usuario" : "Cambiar Contraseña"}
              </FieldLegend>
              <FieldGroup>
                {mode === "create" ? (
                  <>
                    <Field>
                      <FieldLabel htmlFor="input-correo">Correo</FieldLabel>
                      <Input id="input-correo" name="correo" type="email" placeholder="ej. usuario@correo.com" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="input-contrasenia">Contraseña</FieldLabel>
                      <Input id="input-contrasenia" name="contrasenia" type="password" placeholder="********" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="select-rol">Rol</FieldLabel>
                      <Select value={rol} onValueChange={setRol}>
                        <input type="hidden" name="rol" value={rol} />
                        <SelectTrigger id="select-rol">
                          <SelectValue placeholder="Elige un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="ADMIN">Administrador (ADMIN)</SelectItem>
                            <SelectItem value="WORKER">Trabajador (WORKER)</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </>
                ) : (
                  <>
                    <div className="rounded-lg border border-input bg-muted px-3 py-2 text-sm">
                      <p className="text-xs text-muted-foreground">Usuario</p>
                      <p className="font-medium text-foreground">{data?.correo}</p>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="input-contrasenia-actual">Contraseña actual</FieldLabel>
                      <Input id="input-contrasenia-actual" name="contraseniaActual" type="password" placeholder="••••••••" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="input-nueva-contrasenia">Nueva contraseña</FieldLabel>
                      <Input id="input-nueva-contrasenia" name="nuevaContrasenia" type="password" placeholder="••••••••" required />
                    </Field>
                  </>
                )}

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
