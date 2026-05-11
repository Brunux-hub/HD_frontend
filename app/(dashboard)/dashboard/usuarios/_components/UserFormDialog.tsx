"use client";

import { LucideIcon } from "lucide-react";

import {
  Dialog,
  DialogClose,
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
  FieldSeparator,
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

// Contratos de Dominio
import { Usuario } from "@/types/usuario";
import { useState } from "react";

type Props = {
  mode?: string;
  data?: Usuario;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: Omit<Usuario, "id">) => void;
};

const UserFormDialog = ({
  mode,
  data,
  icon: Icon,
  buttonColor,
  onSubmit,
}: Props) => {
  // Cerar Dialog
  const [open, setOpen] = useState(false);
  // State Campos Formulario
  const [rol, setRol] = useState(data?.rol ?? "");
  const [estado, setEstado] = useState(data?.estado ? "true" : "false");

  // Manejar Submit
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Instancia de Interfaz(FormData) para captura de datos
    const formData = new FormData(e.currentTarget);

    // Captura de datos
    const dataUsuario: Omit<Usuario, "id"> = {
      nombre: formData.get("nombre") as string,
      apellidos: formData.get("apellidos") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      rol: formData.get("rol") as Usuario["rol"],
      especialidad: formData.get("especialidad") as string,
      estado: formData.get("estado") === "true",
    };

    // Enviar Datos
    onSubmit(dataUsuario);

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
                {mode === "create" ? "Crear Usuario" : ""}
                {mode === "edit" ? "Modificar Usuario" : ""}
              </FieldLegend>
              <FieldGroup>
                {/* NOMBRE */}
                <Field>
                  <FieldLabel htmlFor="input-nombre">Nombre</FieldLabel>
                  <Input
                    id="input-nombre"
                    name="nombre"
                    defaultValue={data?.nombre ?? ""}
                    placeholder="ej. John"
                    required
                  />
                </Field>
                {/* APELLIDOS */}
                <Field>
                  <FieldLabel htmlFor="input-apellidos">Apellidos</FieldLabel>
                  <Input
                    id="input-apellidos"
                    name="apellidos"
                    defaultValue={data?.apellidos ?? ""}
                    placeholder="ej. Doe"
                    required
                  />
                </Field>
                {/* EMAIL */}
                <Field>
                  <FieldLabel htmlFor="input-email">Email</FieldLabel>
                  <Input
                    id="input-email"
                    name="email"
                    defaultValue={data?.email ?? ""}
                    placeholder="example@gmail.com"
                    required
                  />
                </Field>
                {/* PASSWORD */}
                <Field>
                  <FieldLabel htmlFor="input-password">Contraseña</FieldLabel>
                  <Input
                    id="input-password"
                    name="password"
                    defaultValue={data?.password ?? ""}
                    placeholder="*********"
                    required
                  />
                </Field>
                {/* ROL */}
                <Field>
                  <FieldLabel htmlFor="select-rol">
                    Elige un Rol para el Usuario
                  </FieldLabel>
                  <Select value={rol} onValueChange={setRol}>
                    <input type="hidden" name="rol" value={rol} />
                    <SelectTrigger id="select-rol">
                      <SelectValue placeholder="Elige un Rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Veterinario">Veterinario</SelectItem>
                        <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {/* ESPECIALIDAD */}
                <Field>
                  <FieldLabel htmlFor="input-especialidad">Especialidad</FieldLabel>
                  <Input
                    id="input-especialidad"
                    name="especialidad"
                    defaultValue={data?.especialidad ?? ""}
                    required
                  />
                </Field>
                {/* ESTADO */}
                <Field>
                  <Select value={estado} onValueChange={setEstado}>
                    <input type="hidden" name="estado" value={estado} />
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="Configura el Estado" />
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

export default UserFormDialog;

