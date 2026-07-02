"use client";

import { useMemo, useState } from "react";
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
import { APPOINTMENT_STATUSES } from "@/types/enums";
import type {
  AppointmentItem,
  CreateAppointmentRequest,
  ReceptionistItem,
} from "@/types/cita";
import type { PetItem } from "@/types/mascota";
import type { VeterinarianItem } from "@/types/veterinario";

type Props = {
  appointments?: AppointmentItem[];
  pets: PetItem[];
  veterinarians: VeterinarianItem[];
  mode?: "create" | "edit";
  data?: AppointmentItem;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: CreateAppointmentRequest) => Promise<void>;
};

function toDateInputValue(iso: string | undefined) {
  return iso ? iso.slice(0, 10) : "";
}

function toIsoDate(dateValue: string) {
  return dateValue ? new Date(`${dateValue}T00:00:00`).toISOString() : "";
}

const AppointmentFormDialog = ({
  appointments = [],
  pets,
  veterinarians,
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState(String(data?.pet.idPet ?? ""));
  const [selectedVeterinarianId, setSelectedVeterinarianId] = useState(
    String(data?.veterinarian.idVeterinarian ?? ""),
  );
  const [selectedStatus, setSelectedStatus] = useState(data?.status ?? "OPENED");

  const receptionists = useMemo(() => {
    const unique = new Map<number, ReceptionistItem>();
    appointments.forEach((appointment) => {
      unique.set(appointment.receptionist.idReceptionist, appointment.receptionist);
    });
    return Array.from(unique.values());
  }, [appointments]);

  const [selectedReceptionistId, setSelectedReceptionistId] = useState(
    String(data?.receptionist.idReceptionist ?? receptionists[0]?.idReceptionist ?? ""),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload: CreateAppointmentRequest = {
      idReceptionist: Number(
        formData.get("idReceptionist") || selectedReceptionistId || 0,
      ),
      idPet: Number(selectedPetId),
      idVeterinarian: Number(selectedVeterinarianId),
      date: toIsoDate(String(formData.get("date") ?? "")),
      timeMinutes: Number(formData.get("timeMinutes") ?? 0),
      reason: String(formData.get("reason") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      status: String(formData.get("status") ?? "OPENED") as CreateAppointmentRequest["status"],
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la cita.");
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
                {mode === "create" ? "Crear Cita" : "Modificar Cita"}
              </FieldLegend>
              <FieldGroup>
                {receptionists.length > 0 ? (
                  <Field>
                    <FieldLabel htmlFor="select-receptionist">Recepcionista</FieldLabel>
                    <Select
                      value={selectedReceptionistId}
                      onValueChange={setSelectedReceptionistId}
                    >
                      <input
                        type="hidden"
                        name="idReceptionist"
                        value={selectedReceptionistId}
                      />
                      <SelectTrigger id="select-receptionist">
                        <SelectValue placeholder="Selecciona un recepcionista" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {receptionists.map((receptionist) => (
                            <SelectItem
                              key={receptionist.idReceptionist}
                              value={String(receptionist.idReceptionist)}
                            >
                              {receptionist.names} {receptionist.lastNames}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                ) : (
                  <Field>
                    <FieldLabel htmlFor="input-id-receptionist">
                      ID Recepcionista
                    </FieldLabel>
                    <Input
                      id="input-id-receptionist"
                      name="idReceptionist"
                      type="number"
                      min="1"
                      defaultValue={data?.receptionist.idReceptionist ?? ""}
                      required
                    />
                  </Field>
                )}
                <Field>
                  <FieldLabel htmlFor="select-pet">Mascota</FieldLabel>
                  <Select value={selectedPetId} onValueChange={setSelectedPetId}>
                    <SelectTrigger id="select-pet">
                      <SelectValue placeholder="Selecciona una mascota" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {pets.map((pet) => (
                          <SelectItem key={pet.idPet} value={String(pet.idPet)}>
                            {pet.name} · {pet.owner.names}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="select-veterinarian">Veterinario</FieldLabel>
                  <Select
                    value={selectedVeterinarianId}
                    onValueChange={setSelectedVeterinarianId}
                  >
                    <SelectTrigger id="select-veterinarian">
                      <SelectValue placeholder="Selecciona un veterinario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {veterinarians.map((veterinarian) => (
                          <SelectItem
                            key={veterinarian.idVeterinarian}
                            value={String(veterinarian.idVeterinarian)}
                          >
                            {veterinarian.names} {veterinarian.lastNames}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-date">Fecha</FieldLabel>
                  <Input
                    id="input-date"
                    name="date"
                    type="date"
                    defaultValue={toDateInputValue(data?.date)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-time-minutes">Duración (min)</FieldLabel>
                  <Input
                    id="input-time-minutes"
                    name="timeMinutes"
                    type="number"
                    min="0"
                    defaultValue={data?.timeMinutes ?? 0}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-reason">Motivo</FieldLabel>
                  <Input
                    id="input-reason"
                    name="reason"
                    defaultValue={data?.reason ?? ""}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-notes">Notas</FieldLabel>
                  <Input
                    id="input-notes"
                    name="notes"
                    defaultValue={data?.notes ?? ""}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="select-status">Estado</FieldLabel>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <input type="hidden" name="status" value={selectedStatus} />
                    <SelectTrigger id="select-status">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {APPOINTMENT_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
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

export default AppointmentFormDialog;
