"use client";

import { useMemo, useState } from "react";
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
import { ClienteResponse } from "@/types/cliente";
import { Service } from "@/types/service";
import { Veterinarian } from "@/types/veterinarian";

const toDateTimeInput = (value?: string) => (value ? value.slice(0, 16) : "");

type Props = {
  pets: Pet[];
  clients: ClienteResponse[];
  services: Service[];
  veterinarians: Veterinarian[];
  currentUserId: number;
  mode?: "create" | "edit";
  data?: Appointment;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: AppointmentRequest) => Promise<void> | void;
};

const AppointmentFormDialog = ({
  pets,
  clients,
  services,
  veterinarians,
  currentUserId,
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<string>(
    data?.idMascota ? String(data.idMascota) : "",
  );
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const initialSpecialty =
    data?.idUsuarioVeterinario
      ? veterinarians.find((vet) => vet.idUsuario === data.idUsuarioVeterinario)
          ?.especialidades[0] ?? ""
      : "";
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialSpecialty);
  const [selectedVet, setSelectedVet] = useState<string>(
    data?.idUsuarioVeterinario ? String(data.idUsuarioVeterinario) : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const availableSpecialties = useMemo(
    () =>
      Array.from(
        new Set(
          veterinarians.flatMap((vet) =>
            vet.especialidades.map((specialty) => specialty.trim()).filter(Boolean),
          ),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [veterinarians],
  );

  const filteredVeterinarians = useMemo(
    () =>
      selectedSpecialty
        ? veterinarians.filter((vet) => vet.especialidades.includes(selectedSpecialty))
        : veterinarians,
    [selectedSpecialty, veterinarians],
  );

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      setError(null);
      setSuccess(false);
      setSelectedClient("");
      setFilteredPets([]);
    }
  };

  const handleClientChange = (id: string) => {
    setSelectedClient(id);
    setSelectedPet("");
    setFilteredPets(id ? pets.filter((p) => p.idUsuarioCliente === Number(id)) : []);
  };

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialty(specialty);
    const selectedVetStillMatches = veterinarians.some(
      (vet) =>
        String(vet.idUsuario) === selectedVet &&
        vet.especialidades.includes(specialty),
    );

    if (!selectedVetStillMatches) {
      setSelectedVet("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const idPet = selectedPet ? Number(selectedPet) : NaN;
    if (!Number.isFinite(idPet)) {
      setError("Selecciona una mascota.");
      return;
    }

    const idVet = selectedVet ? Number(selectedVet) : NaN;
    if (!Number.isFinite(idVet)) {
      setError("Selecciona un veterinario.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload: AppointmentRequest = {
      motivo: formData.get("motivo") as string,
      notas: formData.get("notas") as string,
      fechaProgramada: formData.get("fechaProgramada") as string,
      idUsuarioRecepcionista: currentUserId,
      idServicio: Number(formData.get("idServicio")),
      idMascota: idPet,
      idUsuarioVeterinario: idVet,
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
                    <FieldLabel htmlFor="select-service">Servicio</FieldLabel>
                    <Select name="idServicio">
                      <SelectTrigger id="select-service">
                        <SelectValue placeholder="Selecciona un servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {services.map((s) => (
                            <SelectItem key={s.idServicio} value={String(s.idServicio)}>
                              {s.nombre}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="select-client">Cliente</FieldLabel>
                    <Select value={selectedClient} onValueChange={handleClientChange}>
                      <SelectTrigger id="select-client">
                        <SelectValue placeholder="Selecciona un cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {clients.map((c) => (
                            <SelectItem key={c.idUsuario} value={String(c.idUsuario)}>
                              {c.nombres} {c.apellidos}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="select-pet">Mascota</FieldLabel>
                    <Select value={selectedPet} onValueChange={setSelectedPet} disabled={!selectedClient && !data}>
                      <SelectTrigger id="select-pet">
                        <SelectValue placeholder={selectedClient ? "Selecciona una mascota" : "Primero selecciona un cliente"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {(data ? pets : filteredPets).map((p) => (
                            <SelectItem key={p.idMascota} value={String(p.idMascota)}>
                              {p.nombre}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="select-specialty">Especialidad</FieldLabel>
                    <Select
                      value={selectedSpecialty}
                      onValueChange={handleSpecialtyChange}
                    >
                      <SelectTrigger id="select-specialty">
                        <SelectValue placeholder="Selecciona una especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {availableSpecialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="select-vet">Veterinario</FieldLabel>
                    <Select
                      value={selectedVet}
                      onValueChange={setSelectedVet}
                      disabled={!selectedSpecialty}
                    >
                      <SelectTrigger id="select-vet">
                        <SelectValue
                          placeholder={
                            selectedSpecialty
                              ? "Selecciona un veterinario"
                              : "Primero selecciona una especialidad"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {filteredVeterinarians.map((v) => (
                            <SelectItem key={v.idUsuario} value={String(v.idUsuario)}>
                              {v.nombres} {v.apellidos}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-fecha">Fecha y hora</FieldLabel>
                    <Input
                      id="input-fecha"
                      name="fechaProgramada"
                      type="datetime-local"
                      defaultValue={toDateTimeInput(data?.fechaProgramada)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-motivo">Motivo</FieldLabel>
                    <Input
                      id="input-motivo"
                      name="motivo"
                      defaultValue={data?.motivo ?? ""}
                      placeholder="Escribir motivo"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-notas">Notas</FieldLabel>
                    <Textarea
                      id="input-notas"
                      name="notas"
                      defaultValue={data?.notas ?? ""}
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

export default AppointmentFormDialog;
