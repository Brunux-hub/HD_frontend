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
  onSubmit: (data: ServiceRequest) => Promise<void> | void;
};

const ServiceFormDialog = ({ mode, data, icon: Icon, buttonColor, onSubmit }: Props) => {
  const [open, setOpen] = useState(false);
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
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
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
      <DialogTrigger asChild>
        <Button variant={mode === "create" ? "teal" : buttonColor}>{Icon && <Icon />}{mode === "create" && "Agregar"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only" />
        <DialogDescription className="sr-only" />

        {success ? (
          /* Confirmación de éxito */
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
                    <FieldLabel htmlFor="input-name">Nombre</FieldLabel>
                    <Input
                      id="input-name"
                      name="name"
                      defaultValue={data?.name ?? ""}
                      placeholder="Escribe un servicio"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="textarea-description">Descripción</FieldLabel>
                    <Textarea
                      id="textarea-description"
                      name="description"
                      defaultValue={data?.description ?? ""}
                      placeholder="Agrega una descripción del servicio"
                      className="resize-none"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-price">Precio</FieldLabel>
                    <Input
                      id="input-price"
                      name="price"
                      type="number"
                      defaultValue={data?.price ?? ""}
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
