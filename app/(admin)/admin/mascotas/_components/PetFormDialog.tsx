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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Pet, PetRequest } from "@/types/pet";
import { ClienteResponse } from "@/types/cliente";

const toDateInput = (value?: string) => (value ? value.slice(0, 10) : "");

type Props = {
  ownerId?: number;
  owners?: ClienteResponse[];
  mode?: "create" | "edit";
  data?: Pet;
  open?: boolean;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: PetRequest) => Promise<void> | void;
};

const PetFormDialog = ({
  ownerId,
  owners,
  mode,
  data,
  open: openProp,
  icon: Icon,
  buttonColor,
  onOpenChange,
  onSubmit,
}: Props) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [sex, setSex] = useState(data?.sexo ?? "MACHO");
  const [selectedOwner, setSelectedOwner] = useState<string>(
    ownerId ? String(ownerId) : data?.idUsuarioCliente ? String(data.idUsuarioCliente) : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const open = openProp ?? internalOpen;

  const showOwnerPicker = !ownerId && Boolean(owners);

  const handleOpenChange = (v: boolean) => {
    if (openProp === undefined) {
      setInternalOpen(v);
    }
    onOpenChange?.(v);
    if (!v) {
      setError(null);
      setSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const resolvedOwner = ownerId ?? (selectedOwner ? Number(selectedOwner) : NaN);
    if (!Number.isFinite(resolvedOwner)) {
      setError("Selecciona un dueño.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload: PetRequest = {
      nombre: formData.get("nombre") as string,
      especie: formData.get("especie") as string,
      raza: formData.get("raza") as string,
      sexo: sex,
      fechaNacimiento: formData.get("fechaNacimiento") as string,
      idUsuarioCliente: resolvedOwner as number,
      activo: true,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la mascota.");
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
                {mode === "edit" ? "¡Mascota actualizada!" : "¡Mascota registrada!"}
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
                  {mode === "create" ? "Registrar Mascota" : "Modificar Mascota"}
                </FieldLegend>
                <FieldGroup>
                  {showOwnerPicker && (
                    <Field>
                      <FieldLabel htmlFor="select-owner">Dueño</FieldLabel>
                      <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                        <SelectTrigger id="select-owner">
                          <SelectValue placeholder="Selecciona un dueño" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {owners?.map((o) => (
                              <SelectItem key={o.idUsuario} value={String(o.idUsuario)}>
                                {o.nombres} {o.apellidos}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                  <Field>
                    <FieldLabel htmlFor="input-nombre">Nombre</FieldLabel>
                    <Input id="input-nombre" name="nombre" defaultValue={data?.nombre ?? ""} placeholder="Ej. Luna" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-especie">Especie</FieldLabel>
                    <Input id="input-especie" name="especie" defaultValue={data?.especie ?? ""} placeholder="Ej. Canino" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-raza">Raza</FieldLabel>
                    <Input id="input-raza" name="raza" defaultValue={data?.raza ?? ""} placeholder="Ej. Labrador" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="select-sex">Sexo</FieldLabel>
                    <Select value={sex} onValueChange={setSex}>
                      <input type="hidden" name="sexo" value={sex} />
                      <SelectTrigger id="select-sex">
                        <SelectValue placeholder="Selecciona un sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="MACHO">Macho</SelectItem>
                          <SelectItem value="HEMBRA">Hembra</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-fechaNacimiento">Fecha de nacimiento</FieldLabel>
                    <Input id="input-fechaNacimiento" name="fechaNacimiento" type="date" defaultValue={toDateInput(data?.fechaNacimiento)} required />
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

export default PetFormDialog;
