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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MedicalHistory, MedicalHistoryRequest } from "@/types/medicalHistory";
import { Appointment } from "@/types/appointment";
import { Service } from "@/types/service";
import { fmtDate } from "@/lib/utils";

type Props = {
  appointments: Appointment[];
  services: Service[];
  mode?: "create" | "edit";
  data?: MedicalHistory;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: MedicalHistoryRequest) => Promise<void> | void;
};

const MedicalHistoryFormDialog = ({
  appointments,
  services,
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string>(
    data?.appointment?.id_appointment ? String(data.appointment.id_appointment) : "",
  );
  const [selectedService, setSelectedService] = useState<string>(
    data?.services?.id_service ? String(data.services.id_service) : "",
  );
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

    const resolvedAppointment = selectedAppointment ? Number(selectedAppointment) : NaN;
    if (!Number.isFinite(resolvedAppointment)) {
      setError("Selecciona una cita.");
      return;
    }

    const resolvedService = selectedService ? Number(selectedService) : NaN;
    if (!Number.isFinite(resolvedService)) {
      setError("Selecciona un servicio.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload: MedicalHistoryRequest = {
      id_appointment: resolvedAppointment as number,
      id_service: resolvedService as number,
      weight: formData.get("weight") as string,
      diagnosis: formData.get("diagnosis") as string,
      treatment: formData.get("treatment") as string,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el historial médico.");
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
                {mode === "edit" ? "¡Historial actualizado!" : "¡Historial registrado!"}
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
                  {mode === "create" ? "Registrar Historial Médico" : "Modificar Historial Médico"}
                </FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="select-appointment">Cita</FieldLabel>
                    <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
                      <SelectTrigger id="select-appointment">
                        <SelectValue placeholder="Selecciona una cita" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {appointments.map((a) => (
                            <SelectItem key={a.id_appointment} value={String(a.id_appointment)}>
                              {`Cita #${a.id_appointment} — ${a.pet?.name} (${fmtDate(a.date)})`}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="select-service">Servicio</FieldLabel>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger id="select-service">
                        <SelectValue placeholder="Selecciona un servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {services.map((s) => (
                            <SelectItem key={s.id_service} value={String(s.id_service)}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-weight">Peso (kg)</FieldLabel>
                    <Input
                      id="input-weight"
                      name="weight"
                      defaultValue={data?.weight ?? ""}
                      placeholder="Ej. 8.5"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-diagnosis">Diagnóstico</FieldLabel>
                    <Textarea
                      id="input-diagnosis"
                      name="diagnosis"
                      defaultValue={data?.diagnosis ?? ""}
                      placeholder="Ej. Otitis externa"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-treatment">Tratamiento</FieldLabel>
                    <Textarea
                      id="input-treatment"
                      name="treatment"
                      defaultValue={data?.treatment ?? ""}
                      placeholder="Ej. Limpiador ótico c/s 7 días"
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

export default MedicalHistoryFormDialog;
