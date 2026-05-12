"use client";

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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import { Servicio } from "@/types/servicio";
import { useState } from "react";

type Props = {
  mode?: string;
  data?: Servicio;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: Omit<Servicio, "id">) => void;
};

const ServiceFormDialog = ({
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  // Cerar Dialog
  const [open, setOpen] = useState(false);
  // State Campos Formulario
  const [categoria, setCategoria] = useState(data?.categoria ?? "");
  const [estado, setEstado] = useState(data?.estado ? "true" : "false");

  // Manejar Submit
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Instancia de Interfaz(FormData) para captura de datos
    const formData = new FormData(e.currentTarget);

    // Captura de datos
    const dataServicio: Omit<Servicio, "id"> = {
      nombre: formData.get("servicio") as string,
      categoria: formData.get("categoria") as Servicio["categoria"],
      descripcion: formData.get("descripcion") as string,
      precio: Number(formData.get("precio")),
      estado: formData.get("estado") === "true",
    };

    // Enviar Datos
    onSubmit(dataServicio);

    // Cambiar a false para Cerar Dialog
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
        {/*Formulario */}
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="text-center font-semibold text-xl">
                {mode === "create" ? "Crear Servicio" : ""}
                {mode === "edit" ? "Modificar Servicio" : ""}
              </FieldLegend>
              <FieldGroup>
                {/* SERVICIO */}
                <Field>
                  <FieldLabel htmlFor="input-servicio">Servicio</FieldLabel>
                  <Input
                    id="input-servicio"
                    name="servicio"
                    defaultValue={data?.nombre ?? ""}
                    placeholder="Escribe un servicio"
                    required
                  />
                </Field>
                {/* CATEGORÍA */}
                <Field>
                  <FieldLabel htmlFor="select-categoria">
                    Elige una Categoria
                  </FieldLabel>
                  <Select value={categoria} onValueChange={setCategoria}>
                    <input type="hidden" name="categoria" value={categoria} />
                    <SelectTrigger id="select-categoria">
                      <SelectValue placeholder="Elige un Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="consulta">Consulta</SelectItem>
                        <SelectItem value="cirugia">Cirugia</SelectItem>
                        <SelectItem value="grooming">Grooming</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {/* DESCRIPCIÓN */}
                <Field>
                  <FieldLabel htmlFor="textarea-descripcion">
                    Descripción
                  </FieldLabel>
                  <Textarea
                    id="textarea-descripcion"
                    name="descripcion"
                    defaultValue={data?.descripcion ?? ""}
                    placeholder="Agrea una descripción del Servicio"
                    className="resize-none"
                  />
                </Field>
                {/* PRECIO */}
                <Field>
                  <FieldLabel htmlFor="input-precio">Precio</FieldLabel>
                  <Input
                    id="input-precio"
                    name="precio"
                    defaultValue={data?.precio ?? ""}
                    placeholder="0"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  />
                </Field>
                {/* ESTADO */}
                <Field>
                  <Select value={estado} onValueChange={setEstado}>
                    <input type="hidden" name="estado" value={estado} />
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="Estado del Servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="true">Activo</SelectItem>
                        <SelectItem value="false">Inactivo</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {/* BOTON SUBMIT */}
                <Field orientation="horizontal"  className="justify-center gap-4">
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

export default ServiceFormDialog;
