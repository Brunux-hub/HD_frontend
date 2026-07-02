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

import { PET_GENDERS } from "@/types/enums";
import type { Owner } from "@/types/owner";
import type { CreatePetRequest, PetItem } from "@/types/mascota";

type Props = {
  ownerId?: number;
  owners?: Owner[];
  mode?: "create" | "edit";
  data?: PetItem;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: CreatePetRequest) => Promise<void>;
};

const PetFormDialog = ({
  ownerId,
  owners = [],
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [sex, setSex] = useState(data?.petGender ?? "MALE");
  const [selectedOwnerId, setSelectedOwnerId] = useState(
    String(ownerId ?? data?.owner.idOwner ?? ""),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const resolvedOwnerId = Number(ownerId ?? selectedOwnerId);

    const petData: CreatePetRequest = {
      idOwner: resolvedOwnerId,
      name: formData.get("name") as string,
      species: formData.get("species") as string,
      race: formData.get("race") as string,
      birthdate: formData.get("birthdate") as string,
      sex: formData.get("sex") as CreatePetRequest["sex"],
      weight: formData.get("weight") as string,
    };

    try {
      setSubmitting(true);
      await onSubmit(petData);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la mascota.");
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
                {mode === "create" ? "Registrar Mascota" : "Modificar Mascota"}
              </FieldLegend>
              <FieldGroup>
                {ownerId == null && (
                  <Field>
                    <FieldLabel htmlFor="select-owner">Dueño</FieldLabel>
                    <Select value={selectedOwnerId} onValueChange={setSelectedOwnerId}>
                      <input type="hidden" name="idOwner" value={selectedOwnerId} />
                      <SelectTrigger id="select-owner">
                        <SelectValue placeholder="Selecciona un dueño" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {owners.map((owner) => (
                            <SelectItem key={owner.idOwner} value={String(owner.idOwner)}>
                              {owner.names} {owner.lastNames}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                <Field>
                  <FieldLabel htmlFor="input-name">Nombre</FieldLabel>
                  <Input
                    id="input-name"
                    name="name"
                    defaultValue={data?.name ?? ""}
                    placeholder="Ej. Luna"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-species">Especie</FieldLabel>
                  <Input
                    id="input-species"
                    name="species"
                    defaultValue={data?.species ?? ""}
                    placeholder="Ej. Canino"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-race">Raza</FieldLabel>
                  <Input
                    id="input-race"
                    name="race"
                    defaultValue={data?.race ?? ""}
                    placeholder="Ej. Labrador"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-weight">Peso</FieldLabel>
                  <Input
                    id="input-weight"
                    name="weight"
                    defaultValue={data?.weight ?? ""}
                    placeholder="Ej. 12.5 kg"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="select-sex">Sexo</FieldLabel>
                  <Select value={sex} onValueChange={(value) => setSex(value as CreatePetRequest["sex"])}>
                    <input type="hidden" name="sex" value={sex} />
                    <SelectTrigger id="select-sex">
                      <SelectValue placeholder="Selecciona un sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {PET_GENDERS.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-birthdate">Fecha de nacimiento</FieldLabel>
                  <Input
                    id="input-birthdate"
                    name="birthdate"
                    type="date"
                    defaultValue={data?.birthdate?.slice(0, 10) ?? ""}
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

export default PetFormDialog;
