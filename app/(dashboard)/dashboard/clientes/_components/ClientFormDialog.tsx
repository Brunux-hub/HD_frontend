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

import { Owner, OwnerRequest } from "@/types/owner";
import { getOwnerByDni } from "@/services/owners/owners";

type Props = {
  mode?: "create" | "edit";
  data?: Owner;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  onSubmit: (data: OwnerRequest) => Promise<void> | void;
};

const ClientFormDialog = ({ mode, data, icon: Icon, buttonColor, onSubmit }: Props) => {
  const isEdit = mode === "edit";
  const [open, setOpen] = useState(false);
  // En crear se arranca en el paso de búsqueda por DNI; en editar se va directo al formulario.
  const [step, setStep] = useState<"search" | "form">(isEdit ? "form" : "search");
  const [dni, setDni] = useState(data?.dni ?? "");
  const [existing, setExisting] = useState<Owner | null>(null);
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
    const payload: OwnerRequest = {
      dni: dni.trim(),
      names: formData.get("names") as string,
      last_names: formData.get("last_names") as string,
      email: formData.get("email") as string,
      phone_number: formData.get("phone_number") as string,
      address: formData.get("address") as string,
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
          /* Paso 1: verificar por DNI */
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
                      onChange={(e) => setDni(e.target.value)}
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
                        {existing.names} {existing.last_names}
                      </p>
                      <Button asChild variant="outline" className="mt-2">
                        <Link href={`/dashboard/clientes/${existing.id_owner}`} onClick={() => handleOpenChange(false)}>
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
          /* Paso 2: datos del cliente */
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="text-center text-xl font-semibold">
                  {isEdit ? "Modificar Cliente" : "Datos del Cliente"}
                </FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="input-dni">DNI</FieldLabel>
                    <Input
                      id="input-dni"
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                      readOnly={!isEdit}
                      className={!isEdit ? "bg-muted" : undefined}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-names">Nombres</FieldLabel>
                    <Input id="input-names" name="names" defaultValue={data?.names ?? ""} placeholder="Ej. Juan Carlos" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-last-names">Apellidos</FieldLabel>
                    <Input id="input-last-names" name="last_names" defaultValue={data?.last_names ?? ""} placeholder="Ej. Pérez García" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-email">Email</FieldLabel>
                    <Input id="input-email" name="email" type="email" defaultValue={data?.email ?? ""} placeholder="cliente@email.com" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-phone">Teléfono</FieldLabel>
                    <Input id="input-phone" name="phone_number" defaultValue={data?.phone_number ?? ""} placeholder="Ej. 987654321" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-address">Dirección</FieldLabel>
                    <Input id="input-address" name="address" defaultValue={data?.address ?? ""} placeholder="Av. Principal 123" required />
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
