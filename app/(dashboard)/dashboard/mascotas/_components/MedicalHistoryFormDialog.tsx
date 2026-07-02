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

import type { CreateMedicalHistoryRequest } from "@/types/medicalHistory";
import type { ServiceItem } from "@/types/servicio";
import type { AppointmentItem } from "@/types/cita";

type Props = {
  services: ServiceItem[];
  appointments: AppointmentItem[];
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: CreateMedicalHistoryRequest) => Promise<void>;
};

const MedicalHistoryFormDialog = ({
  services,
  appointments,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [idService, setIdService] = useState("");
  const [idAppointment, setIdAppointment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const data: CreateMedicalHistoryRequest = {
      idAppointment: Number(idAppointment),
      idService: Number(idService),
      description: formData.get("description") as string,
      date: formData.get("date") as string,
    };

    if (!data.idService) {
      setError("Debes seleccionar un servicio.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(data);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el registro.");
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
                Nuevo registro médico
              </FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="input-date">Fecha</FieldLabel>
                  <Input
                    id="input-date"
                    name="date"
                    type="date"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="select-service">Servicio</FieldLabel>
                  <Select value={idService} onValueChange={setIdService}>
                    <input type="hidden" name="idService" value={idService} />
                    <SelectTrigger id="select-service">
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {services.map((service) => (
                          <SelectItem key={service.idService} value={String(service.idService)}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="select-appointment">Cita (opcional)</FieldLabel>
                  <Select value={idAppointment} onValueChange={setIdAppointment}>
                    <input type="hidden" name="idAppointment" value={idAppointment} />
                    <SelectTrigger id="select-appointment">
                      <SelectValue placeholder="Selecciona una cita" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {appointments.map((appt) => (
                          <SelectItem key={appt.idAppointment} value={String(appt.idAppointment)}>
                            {appt.date.slice(0, 10)} - {appt.reason}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-description">Descripción</FieldLabel>
                  <textarea
                    id="input-description"
                    name="description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Describe el diagnóstico o procedimiento"
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

export default MedicalHistoryFormDialog;
