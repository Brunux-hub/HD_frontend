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

import { Veterinarian, VeterinarianRequest } from "@/types/veterinarian";
import { User } from "@/types/user";

type Props = {
  /** Lista de usuarios para asociar la cuenta de acceso al veterinario. */
  users: User[];
  mode?: "create" | "edit";
  data?: Veterinarian;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: VeterinarianRequest) => Promise<void> | void;
};

const VetFormDialog = ({ users, mode, data, icon: Icon, buttonColor, onSubmit }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>(
    data?.user_response?.id_user ? String(data.user_response.id_user) : "",
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

    const resolvedUser = selectedUser ? Number(selectedUser) : NaN;
    if (!Number.isFinite(resolvedUser)) {
      setError("Selecciona un usuario.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload: VeterinarianRequest = {
      id_user: resolvedUser as number,
      names: formData.get("names") as string,
      last_names: formData.get("last_names") as string,
      number_license: formData.get("number_license") as string,
      specialty: formData.get("specialty") as string,
      email: formData.get("email") as string,
      phone_number: formData.get("phone_number") as string,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el veterinario.");
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
                {mode === "edit" ? "¡Veterinario actualizado!" : "¡Veterinario registrado!"}
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
                  {mode === "create" ? "Registrar Veterinario" : "Modificar Veterinario"}
                </FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="select-user">Usuario</FieldLabel>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger id="select-user">
                        <SelectValue placeholder="Selecciona un usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {users.map((u) => (
                            <SelectItem key={u.id_user} value={String(u.id_user)}>
                              {u.username}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-names">Nombres</FieldLabel>
                    <Input id="input-names" name="names" defaultValue={data?.names ?? ""} placeholder="Ej. Juan Carlos" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-last_names">Apellidos</FieldLabel>
                    <Input id="input-last_names" name="last_names" defaultValue={data?.last_names ?? ""} placeholder="Ej. Pérez Gómez" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-number_license">N° Licencia</FieldLabel>
                    <Input id="input-number_license" name="number_license" defaultValue={data?.number_license ?? ""} placeholder="Ej. CMV-12345" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-specialty">Especialidad</FieldLabel>
                    <Input id="input-specialty" name="specialty" defaultValue={data?.specialty ?? ""} placeholder="Ej. Cirugía" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-email">Email</FieldLabel>
                    <Input id="input-email" name="email" type="email" defaultValue={data?.email ?? ""} placeholder="Ej. vet@correo.com" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-phone_number">Teléfono</FieldLabel>
                    <Input id="input-phone_number" name="phone_number" defaultValue={data?.phone_number ?? ""} placeholder="Ej. 987654321" required />
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

export default VetFormDialog;
