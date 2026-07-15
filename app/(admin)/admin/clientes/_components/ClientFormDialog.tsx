"use client";

import { useState } from "react";
import Link from "next/link";
import { LucideIcon, Search, Loader2, CheckCircle2, UserCheck } from "lucide-react";

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

import { ClienteResponse, ClienteRequest } from "@/types/cliente";
import { getOwnerByDni } from "@/services/owners/owners";

type Props = {
  mode?: "create" | "edit";
  data?: ClienteResponse;
  basePath?: string;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: ClienteRequest) => Promise<void> | void;
};

const ClientFormDialog = ({ mode, data, basePath = "/admin/clientes", icon: Icon, buttonColor, onSubmit }: Props) => {
  const isEdit = mode === "edit";
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"search" | "form">(isEdit ? "form" : "search");
  const [dni, setDni] = useState(data?.dni ?? "");
  const [existing, setExisting] = useState<ClienteResponse | null>(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setStep(isEdit ? "form" : "search");
    setDni(data?.dni ?? "");
    setExisting(null);
    setError(null);
    setSuccess(false);
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) reset();
  };

  const handleSearch = async () => {
    setError(null);
    setExisting(null);
    if (!dni.trim()) {
      setError("Ingresa un DNI.");
      return;
    }
    setSearching(true);
    try {
      const found = await getOwnerByDni(dni.trim());
      if (found) setExisting(found);
      else setStep("form");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo verificar el DNI.");
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const telefono = (formData.get("telefono") as string).replace(/\D/g, "");
    if (telefono.length !== 9) {
      setError("El teléfono debe tener exactamente 9 dígitos.");
      return;
    }

    const payload: ClienteRequest = {
      correo: formData.get("correo") as string,
      contrasenia: isEdit ? (formData.get("contrasenia") as string) : (formData.get("contrasenia") as string),
      nombres: formData.get("nombres") as string,
      apellidos: formData.get("apellidos") as string,
      dni: dni.trim(),
      telefono,
      direccion: formData.get("direccion") as string,
      habilitado: true,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el cliente.");
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
              <CheckCircle2 className="h-11 w-11" />
            </span>
            <p className="text-lg font-semibold">
              {isEdit ? "¡Cliente actualizado!" : "¡Cliente registrado!"}
            </p>
            <Button onClick={() => handleOpenChange(false)}>Listo</Button>
          </div>
        ) : step === "search" ? (
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="text-center text-xl font-semibold">Registrar Cliente</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="search-dni">DNI del cliente</FieldLabel>
                  <div className="flex gap-2">
                    <Input
                      id="search-dni"
                      value={dni}
                      onChange={(e) => setDni(e.target.value.replace(/\D/g, "").slice(0, 9))}
                      placeholder="Ej. 45678912"
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(); } }}
                    />
                    <Button type="button" onClick={handleSearch} disabled={searching}>
                      {searching ? <Loader2 className="animate-spin" /> : <Search />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Verificamos si el cliente ya está registrado antes de crearlo.
                  </p>
                </Field>

                {existing && (
                  <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900/40 dark:bg-amber-950/30">
                    <UserCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-300">
                        Ya existe un cliente con ese DNI:
                      </p>
                      <p className="text-amber-700 dark:text-amber-200">
                        {existing.nombres} {existing.apellidos}
                      </p>
                      <Button asChild variant="outline" className="mt-2">
                        <Link href={`${basePath}/${existing.idUsuario}`} onClick={() => handleOpenChange(false)}>
                          Ver perfil
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                {error && <p className="text-center text-sm font-medium text-destructive">{error}</p>}
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="text-center text-xl font-semibold">
                  {isEdit ? "Modificar Cliente" : "Datos del Cliente"}
                </FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="input-correo">Correo</FieldLabel>
                    <Input id="input-correo" name="correo" type="email" defaultValue={data?.usuario?.correo ?? ""} placeholder="cliente@email.com" required />
                  </Field>
                  {!isEdit && (
                    <Field>
                      <FieldLabel htmlFor="input-contrasenia">Contraseña</FieldLabel>
                      <Input id="input-contrasenia" name="contrasenia" type="password" placeholder="••••••••" required />
                    </Field>
                  )}
                  <Field>
                    <FieldLabel htmlFor="input-nombres">Nombres</FieldLabel>
                    <Input
                      id="input-nombres"
                      name="nombres"
                      defaultValue={data?.nombres ?? ""}
                      placeholder="Ej. Juan Carlos"
                      required
                      onInput={(e) => {
                        const input = e.currentTarget;
                        input.value = input.value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, "");
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-apellidos">Apellidos</FieldLabel>
                    <Input
                      id="input-apellidos"
                      name="apellidos"
                      defaultValue={data?.apellidos ?? ""}
                      placeholder="Ej. Pérez García"
                      required
                      onInput={(e) => {
                        const input = e.currentTarget;
                        input.value = input.value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, "");
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-dni">DNI</FieldLabel>
                    <Input
                      id="input-dni"
                      value={dni}
                      onChange={(e) => setDni(e.target.value.replace(/\D/g, "").slice(0, 9))}
                      readOnly={!isEdit}
                      className={!isEdit ? "bg-muted" : undefined}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-telefono">Teléfono</FieldLabel>
                    <Input
                      id="input-telefono"
                      name="telefono"
                      type="tel"
                      defaultValue={data?.telefono ?? ""}
                      placeholder="Ej. 987654321"
                      required
                      onInput={(e) => {
                        const input = e.currentTarget;
                        input.value = input.value.replace(/\D/g, "").slice(0, 9);
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-direccion">Dirección</FieldLabel>
                    <Input id="input-direccion" name="direccion" defaultValue={data?.direccion ?? ""} placeholder="Av. Principal 123" required />
                  </Field>

                  {error && <p className="text-center text-sm font-medium text-destructive">{error}</p>}

                  <Field orientation="horizontal" className="justify-center gap-4">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (<><Loader2 className="animate-spin" />Guardando...</>) : "Guardar"}
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

export default ClientFormDialog;
