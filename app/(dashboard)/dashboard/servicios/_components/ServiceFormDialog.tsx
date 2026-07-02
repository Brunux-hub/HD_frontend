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

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import { ApiError } from "@/lib/axios";
import type { CreateServiceRequest, ServiceItem } from "@/types/servicio";

type Props = {
  mode?: "create" | "edit";
  data?: ServiceItem;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: CreateServiceRequest) => Promise<void>;
};

const ServiceFormDialog = ({
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSubmitError(null);

    const payload: CreateServiceRequest = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price")),
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
      setOpen(false);
    } catch (error) {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "No se pudo guardar el servicio.";
      setSubmitError(message);
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
                {mode === "create" ? "Crear Servicio" : "Modificar Servicio"}
              </FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="input-name">Servicio</FieldLabel>
                  <Input
                    id="input-name"
                    name="name"
                    defaultValue={data?.name ?? ""}
                    placeholder="Escribe un servicio"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="textarea-descripcion">
                    Descripción
                  </FieldLabel>
                  <Textarea
                    id="textarea-descripcion"
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
                    defaultValue={data?.price ?? ""}
                    placeholder="0"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  />
                </Field>
                {submitError ? (
                  <p className="text-sm text-red-600">{submitError}</p>
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

export default ServiceFormDialog;
