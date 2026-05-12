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

import { Mascota } from "@/types/mascota";

type Props = {
  clienteId: number;
  mode?: "create" | "edit";
  data?: Mascota;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: Omit<Mascota, "id">) => void;
};

const PetFormDialog = ({
  clienteId,
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [sexo, setSexo] = useState<Mascota["sexo"]>(data?.sexo ?? "macho");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const petData: Omit<Mascota, "id"> = {
      nombre: formData.get("nombre") as string,
      especie: formData.get("especie") as string,
      raza: formData.get("raza") as string,
      edad: Number(formData.get("edad")),
      sexo: formData.get("sexo") as Mascota["sexo"],
      fechaNacimiento: formData.get("fechaNacimiento") as string,
      clienteId,
    };

    onSubmit(petData);
    setOpen(false);
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
                <Field>
                  <FieldLabel htmlFor="input-nombre-mascota">Nombre</FieldLabel>
                  <Input
                    id="input-nombre-mascota"
                    name="nombre"
                    defaultValue={data?.nombre ?? ""}
                    placeholder="Ej. Luna"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-especie">Especie</FieldLabel>
                  <Input
                    id="input-especie"
                    name="especie"
                    defaultValue={data?.especie ?? ""}
                    placeholder="Ej. Canino"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-raza">Raza</FieldLabel>
                  <Input
                    id="input-raza"
                    name="raza"
                    defaultValue={data?.raza ?? ""}
                    placeholder="Ej. Labrador"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-edad">Edad</FieldLabel>
                  <Input
                    id="input-edad"
                    name="edad"
                    type="number"
                    min="0"
                    defaultValue={data?.edad ?? 0}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="select-sexo">Sexo</FieldLabel>
                  <Select value={sexo} onValueChange={(value) => setSexo(value as Mascota["sexo"])}>
                    <input type="hidden" name="sexo" value={sexo} />
                    <SelectTrigger id="select-sexo">
                      <SelectValue placeholder="Selecciona un sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="macho">Macho</SelectItem>
                        <SelectItem value="hembra">Hembra</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-fecha-nacimiento">
                    Fecha de nacimiento
                  </FieldLabel>
                  <Input
                    id="input-fecha-nacimiento"
                    name="fechaNacimiento"
                    type="date"
                    defaultValue={data?.fechaNacimiento ?? ""}
                    required
                  />
                </Field>
                <Field
                  orientation="horizontal"
                  className="justify-center gap-4"
                >
                  <Button type="submit">Guardar</Button>
                  <Button
                    variant="outline"
                    type="button"
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
