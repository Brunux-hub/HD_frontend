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

import { Vaccination, VaccinationRequest } from "@/types/vaccination";
import { MedicalHistory } from "@/types/medicalHistory";
import { Vaccine } from "@/types/vaccine";

// Las fechas llegan como "yyyy-MM-dd" (LocalDate); el input date necesita ese mismo formato.
const toDateInput = (value?: string) => (value ? value.slice(0, 10) : "");

type Props = {
  medicalHistories: MedicalHistory[];
  vaccines: Vaccine[];
  mode?: "create" | "edit";
  data?: Vaccination;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: VaccinationRequest) => Promise<void> | void;
};

const VaccinationFormDialog = ({
  medicalHistories,
  vaccines,
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<string>(
    data?.medical_history?.id_medical_history
      ? String(data.medical_history.id_medical_history)
      : "",
  );
  const [selectedVaccine, setSelectedVaccine] = useState<string>(
    data?.vaccine?.id_vaccine ? String(data.vaccine.id_vaccine) : "",
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

    const resolvedHistory = selectedHistory ? Number(selectedHistory) : NaN;
    if (!Number.isFinite(resolvedHistory)) {
      setError("Selecciona un historial médico.");
      return;
    }

    const resolvedVaccine = selectedVaccine ? Number(selectedVaccine) : NaN;
    if (!Number.isFinite(resolvedVaccine)) {
      setError("Selecciona una vacuna.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload: VaccinationRequest = {
      id_medical_history: resolvedHistory as number,
      id_vaccine: resolvedVaccine as number,
      application_date: formData.get("application_date") as string,
      next_application_date: formData.get("next_application_date") as string,
      observation: formData.get("observation") as string,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la vacunación.");
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
                {mode === "edit" ? "¡Vacunación actualizada!" : "¡Vacunación registrada!"}
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
                  {mode === "create" ? "Registrar Vacunación" : "Modificar Vacunación"}
                </FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="select-history">Historial</FieldLabel>
                    <Select value={selectedHistory} onValueChange={setSelectedHistory}>
                      <SelectTrigger id="select-history">
                        <SelectValue placeholder="Selecciona un historial" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {medicalHistories.map((mh) => (
                            <SelectItem
                              key={mh.id_medical_history}
                              value={String(mh.id_medical_history)}
                            >
                              Historial #{mh.id_medical_history} — {mh.services?.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="select-vaccine">Vacuna</FieldLabel>
                    <Select value={selectedVaccine} onValueChange={setSelectedVaccine}>
                      <SelectTrigger id="select-vaccine">
                        <SelectValue placeholder="Selecciona una vacuna" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {vaccines.map((v) => (
                            <SelectItem key={v.id_vaccine} value={String(v.id_vaccine)}>
                              {v.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-application-date">Fecha de aplicación</FieldLabel>
                    <Input
                      id="input-application-date"
                      name="application_date"
                      type="date"
                      defaultValue={toDateInput(data?.application_date)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-next-application-date">Próxima dosis</FieldLabel>
                    <Input
                      id="input-next-application-date"
                      name="next_application_date"
                      type="date"
                      defaultValue={toDateInput(data?.next_application_date)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-observation">Observación</FieldLabel>
                    <Textarea
                      id="input-observation"
                      name="observation"
                      defaultValue={data?.observation ?? ""}
                      placeholder="Ej. Sin reacciones adversas."
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
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleOpenChange(false)}
                      disabled={submitting}
                    >
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

export default VaccinationFormDialog;
