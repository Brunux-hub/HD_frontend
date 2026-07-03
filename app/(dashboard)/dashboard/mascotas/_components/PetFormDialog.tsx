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
import { Owner } from "@/types/owner";
import type { PetGender } from "@/types/enums";

// La respuesta trae birthdate en ISO ("yyyy-MM-ddT..."); el input date necesita "yyyy-MM-dd".
const toDateInput = (value?: string) => (value ? value.slice(0, 10) : "");

type Props = {
  /** Dueño fijo (perfil de cliente). Si no se pasa, se muestra el selector de dueños. */
  ownerId?: number;
  /** Lista de dueños para elegir (listado general). */
  owners?: Owner[];
  mode?: "create" | "edit";
  data?: Pet;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: PetRequest) => Promise<void> | void;
};

const PetFormDialog = ({ ownerId, owners, mode, data, icon: Icon, buttonColor, onSubmit }: Props) => {
  const [open, setOpen] = useState(false);
  const [species, setSpecies] = useState(data?.species ?? "DOG");
  const [sex, setSex] = useState<PetGender>(data?.pet_gender ?? "MALE");
  const [selectedOwner, setSelectedOwner] = useState<string>(
    ownerId ? String(ownerId) : data?.owner?.id_owner ? String(data.owner.id_owner) : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const showOwnerPicker = !ownerId && Boolean(owners);

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

    const resolvedOwner = ownerId ?? (selectedOwner ? Number(selectedOwner) : NaN);
    if (!Number.isFinite(resolvedOwner)) {
      setError("Selecciona un dueño.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload: PetRequest = {
      id_owner: resolvedOwner as number,
      name: formData.get("name") as string,
      species,
      race: formData.get("race") as string,
      birthdate: formData.get("birthdate") as string,
      sex,
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
          /* Confirmación de éxito */
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
                              <SelectItem key={o.id_owner} value={String(o.id_owner)}>
                                {o.names} {o.last_names}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                  <Field>
                    <FieldLabel htmlFor="input-name">Nombre</FieldLabel>
                    <Input id="input-name" name="name" defaultValue={data?.name ?? ""} placeholder="Ej. Luna" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="select-species">Especie</FieldLabel>
                    <Select value={species} onValueChange={setSpecies}>
                      <input type="hidden" name="species" value={species} />
                      <SelectTrigger id="select-species">
                        <SelectValue placeholder="Selecciona una especie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="DOG">Perro</SelectItem>
                          <SelectItem value="CAT">Gato</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-race">Raza</FieldLabel>
                    <Input id="input-race" name="race" defaultValue={data?.race ?? ""} placeholder="Ej. Labrador" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="select-sex">Sexo</FieldLabel>
                    <Select value={sex} onValueChange={(v) => setSex(v as PetGender)}>
                      <input type="hidden" name="sex" value={sex} />
                      <SelectTrigger id="select-sex">
                        <SelectValue placeholder="Selecciona un sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="MALE">Macho</SelectItem>
                          <SelectItem value="FEMALE">Hembra</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-birthdate">Fecha de nacimiento</FieldLabel>
                    <Input id="input-birthdate" name="birthdate" type="date" defaultValue={toDateInput(data?.birthdate)} required />
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
