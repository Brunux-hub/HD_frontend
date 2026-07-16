"use client";

import { useState } from "react";
import { LucideIcon, CheckCircle2, Loader2 } from "lucide-react";

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

import { Receptionist, ReceptionistRequest } from "@/types/receptionist";

type Props = {
  mode?: "create" | "edit";
  data?: Receptionist;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: ReceptionistRequest) => Promise<void> | void;
};

const ReceptionistFormDialog = ({ mode, data, icon: Icon, buttonColor, open: externalOpen, onOpenChange, onSubmit }: Props) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      setError(null);
      setSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const telefono = (formData.get("telefono") as string).replace(/\D/g, "");
    if (telefono.length !== 9) {
      setError("El teléfono debe tener exactamente 9 dígitos.");
      return;
    }

    const payload: ReceptionistRequest = {
      correo: formData.get("correo") as string,
      contrasenia: formData.get("contrasenia") as string,
      nombres: formData.get("nombres") as string,
      apellidos: formData.get("apellidos") as string,
      telefono,
      habilitado: true,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el recepcionista.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={mode === "create" ? "teal" : buttonColor}>{Icon && <Icon />}{mode === "create" && "Agregar"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only" />
        <DialogDescription className="sr-only" />

        {success ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 duration-500 animate-in zoom-in-50 dark:bg-green-900/40 dark:text-green-400">
              <CheckCircle2 className="h-11 w-11 duration-700 animate-in fade-in" />
            </span>
            <div className="duration-500 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-lg font-semibold">
                {mode === "edit" ? "¡Recepcionista actualizado!" : "¡Recepcionista registrado!"}
              </p>
              <p className="text-sm text-muted-foreground">
                Los datos se guardaron correctamente.
              </p>
            </div>
            <Button onClick={() => handleOpenChange(false)} className="mt-2">
              Listo
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="text-center text-xl font-semibold">
                  {mode === "create" ? "Registrar Recepcionista" : "Modificar Recepcionista"}
                </FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="input-correo">Correo</FieldLabel>
                    <Input id="input-correo" name="correo" type="email" defaultValue={data?.usuario?.correo ?? ""} placeholder="Ej. recep@correo.com" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-contrasenia">Contraseña</FieldLabel>
                    <Input id="input-contrasenia" name="contrasenia" type="password" placeholder="••••••••" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-nombres">Nombres</FieldLabel>
                    <Input
                      id="input-nombres"
                      name="nombres"
                      defaultValue={data?.nombres ?? ""}
                      placeholder="Ej. Ana María"
                      required
                      onInput={(e) => {
                        const input = e.currentTarget;
                        input.value = input.value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, "");
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-apellidos">Apellidos</FieldLabel>
                    <Input
                      id="input-apellidos"
                      name="apellidos"
                      defaultValue={data?.apellidos ?? ""}
                      placeholder="Ej. Pérez Gómez"
                      required
                      onInput={(e) => {
                        const input = e.currentTarget;
                        input.value = input.value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, "");
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-telefono">Teléfono</FieldLabel>
                    <Input
                      id="input-telefono"
                      name="telefono"
                      type="tel"
                      defaultValue={data?.telefono ?? ""}
                      placeholder="Ej. 987654321"
                      required
                      onInput={(e) => {
                        const input = e.currentTarget;
                        input.value = input.value.replace(/\D/g, "").slice(0, 9);
                      }}
                    />
                  </Field>

                  {error && (
                    <p className="text-center text-sm font-medium text-destructive">{error}</p>
                  )}

                  <Field orientation="horizontal" className="justify-center gap-4">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        "Guardar"
                      )}
                    </Button>
                    <Button variant="outline" type="button" onClick={() => handleOpenChange(false)} disabled={submitting}>
                      Cancelar
                    </Button>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceptionistFormDialog;
