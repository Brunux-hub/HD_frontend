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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Service, ServiceRequest } from "@/types/service";

type Props = {
  mode?: "create" | "edit";
  data?: Service;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: ServiceRequest) => Promise<void> | void;
};

const ServiceFormDialog = ({ mode, data, icon: Icon, buttonColor, open: externalOpen, onOpenChange, onSubmit }: Props) => {
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
    const payload: ServiceRequest = {
      nombre: formData.get("nombre") as string,
      descripcion: formData.get("descripcion") as string,
      precio: Number(formData.get("precio")),
      activo: true,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el servicio.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant={mode === "create" ? "teal" : buttonColor}>{Icon && <Icon />}{mode === "create" && "Agregar"}</Button>
        </DialogTrigger>
      )}
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
                {mode === "edit" ? "¡Servicio actualizado!" : "¡Servicio registrado!"}
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
                  {mode === "create" ? "Crear Servicio" : "Modificar Servicio"}
                </FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="input-nombre">Nombre</FieldLabel>
                    <Input
                      id="input-nombre"
                      name="nombre"
                      defaultValue={data?.nombre ?? ""}
                      placeholder="Escribe un servicio"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="textarea-descripcion">Descripción</FieldLabel>
                    <Textarea
                      id="textarea-descripcion"
                      name="descripcion"
                      defaultValue={data?.descripcion ?? ""}
                      placeholder="Agrega una descripción del servicio"
                      className="resize-none"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-precio">Precio</FieldLabel>
                    <Input
                      id="input-precio"
                      name="precio"
                      type="number"
                      defaultValue={data?.precio ?? ""}
                      placeholder="0"
                      min="0"
                      required
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

export default ServiceFormDialog;
