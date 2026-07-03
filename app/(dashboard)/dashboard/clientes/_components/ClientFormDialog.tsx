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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Owner, OwnerRequest, DocumentType } from "@/types/owner";
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
  const [documentType, setDocumentType] = useState<DocumentType>("DNI");
  const [dni, setDni] = useState(data?.dni ?? "");
  const [phone, setPhone] = useState(data?.phone_number ?? "");
  const [existing, setExisting] = useState<Owner | null>(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const maxDigits = documentType === "DNI" ? 8 : 9;

  const handleDniChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, maxDigits);
    setDni(digits);
  };

  const reset = () => {
    setStep(isEdit ? "form" : "search");
    setDocumentType("DNI");
    setDni(data?.dni ?? "");
    setPhone(data?.phone_number ?? "");
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
      setError(`Ingresa un ${documentType}.`);
      return;
    }
    setSearching(true);
    try {
      const found = await getOwnerByDni(dni.trim());
      if (found) setExisting(found);
      else setStep("form");
    } catch (err) {
      setError(err instanceof Error ? err.message : `No se pudo verificar el ${documentType}.`);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const payload: OwnerRequest = {
      document_type: documentType,
      dni: dni.trim(),
      names: formData.get("names") as string,
      last_names: formData.get("last_names") as string,
      email: formData.get("email") as string,
      phone_number: phone,
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
          /* Paso 1: verificar por DNI/CE */
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="text-center text-xl font-semibold">Registrar Cliente</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="search-dni">Documento del cliente</FieldLabel>
                  <div className="flex gap-2">
                    <Select
                      value={documentType}
                      onValueChange={(v) => { setDocumentType(v as DocumentType); setDni(""); }}
                    >
                      <SelectTrigger className="w-24 shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DNI">DNI</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="search-dni"
                      value={dni}
                      onChange={(e) => handleDniChange(e.target.value)}
                      placeholder={documentType === "DNI" ? "Ej. 45678912" : "Ej. 123456789"}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(); } }}
                      className="flex-1"
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
                        Ya existe un cliente con ese {documentType}:
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
                    <FieldLabel htmlFor="input-dni">Documento</FieldLabel>
                    <div className="flex gap-2">
                      <Select
                        value={documentType}
                        onValueChange={(v) => { setDocumentType(v as DocumentType); setDni(""); }}
                        disabled={!isEdit}
                      >
                        <SelectTrigger className="w-24 shrink-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DNI">DNI</SelectItem>
                          <SelectItem value="CE">CE</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="input-dni"
                        value={dni}
                        onChange={(e) => handleDniChange(e.target.value)}
                        readOnly={!isEdit}
                        className={!isEdit ? "bg-muted flex-1" : "flex-1"}
                        required
                      />
                    </div>
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
                    <Input id="input-phone" name="phone_number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="Ej. 987654321" required />
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
