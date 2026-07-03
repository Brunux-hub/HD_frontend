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

import { Appointment, AppointmentRequest } from "@/types/appointment";
import { Pet } from "@/types/pet";
import { Veterinarian } from "@/types/veterinarian";

// La respuesta trae date como LocalDateTime ISO; el input datetime-local necesita "yyyy-MM-ddTHH:mm".
const toDateTimeInput = (value?: string) => (value ? value.slice(0, 16) : "");

type Props = {
  pets: Pet[];
  veterinarians: Veterinarian[];
  mode?: "create" | "edit";
  data?: Appointment;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: AppointmentRequest) => Promise<void> | void;
};

const AppointmentFormDialog = ({
  pets,
  veterinarians,
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<string>(
    data?.pet?.id_pet ? String(data.pet.id_pet) : "",
  );
  const [selectedVet, setSelectedVet] = useState<string>(
    data?.veterinarian?.id_veterinarian ? String(data.veterinarian.id_veterinarian) : "",
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

    const idPet = selectedPet ? Number(selectedPet) : NaN;
    const idVet = selectedVet ? Number(selectedVet) : NaN;

    if (!Number.isFinite(idPet)) {
      setError("Selecciona una mascota.");
      return;
    }
    if (!Number.isFinite(idVet)) {
      setError("Selecciona un veterinario.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload: AppointmentRequest = {
      id_pet: idPet,
      id_veterinarian: idVet,
      date: formData.get("date") as string,
      reason: formData.get("reason") as string,
      notes: formData.get("notes") as string,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la cita.");
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
                {mode === "edit" ? "¡Cita actualizada!" : "¡Cita registrada!"}
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
                  {mode === "create" ? "Registrar Cita" : "Modificar Cita"}
                </FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="select-pet">Mascota</FieldLabel>
                    <Select value={selectedPet} onValueChange={setSelectedPet}>
                      <SelectTrigger id="select-pet">
                        <SelectValue placeholder="Selecciona una mascota" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {pets.map((p) => (
                            <SelectItem key={p.id_pet} value={String(p.id_pet)}>
                              {p.name} — {p.owner?.names} {p.owner?.last_names}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="select-vet">Veterinario</FieldLabel>
                    <Select value={selectedVet} onValueChange={setSelectedVet}>
                      <SelectTrigger id="select-vet">
                        <SelectValue placeholder="Selecciona un veterinario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {veterinarians.map((v) => (
                            <SelectItem key={v.id_veterinarian} value={String(v.id_veterinarian)}>
                              {v.names} {v.last_names}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="input-date">Fecha y hora</FieldLabel>
                    <Input
                      id="input-date"
                      name="date"
                      type="datetime-local"
                      defaultValue={toDateTimeInput(data?.date)}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="input-reason">Motivo <span className="text-xs text-muted-foreground font-normal">(opcional)</span></FieldLabel>
                    <Input
                      id="input-reason"
                      name="reason"
                      defaultValue={data?.reason ?? ""}
                      placeholder="Ej. Vacunación"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="input-notes">Notas <span className="text-xs text-muted-foreground font-normal">(opcional)</span></FieldLabel>
                    <Textarea
                      id="input-notes"
                      name="notes"
                      defaultValue={data?.notes ?? ""}
                      placeholder="Observaciones adicionales"
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

export default AppointmentFormDialog;
