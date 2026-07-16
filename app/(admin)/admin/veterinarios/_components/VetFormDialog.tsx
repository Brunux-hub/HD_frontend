"use client";

import { useState } from "react";
import { LucideIcon, CheckCircle2, Loader2, ChevronDown } from "lucide-react";

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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Veterinarian, VeterinarianRequest } from "@/types/veterinarian";

const SPECIALTIES = [
  "CIRUGIA",
  "DERMATOLOGIA",
  "CARDIOLOGIA",
  "RADIOLOGIA",
  "ODONTOLOGIA",
  "NUTRICION",
  "GENERAL",
];

type Props = {
  mode?: "create" | "edit";
  data?: Veterinarian;
  icon?: LucideIcon;
  buttonColor?: "default" | "success" | "alert";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: VeterinarianRequest) => Promise<void> | void;
};

const VetFormDialog = ({ mode, data, icon: Icon, buttonColor, open: externalOpen, onOpenChange, onSubmit }: Props) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const currentEspecialidades = data?.especialidades ?? [];

  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(currentEspecialidades);
  const [licenseNum, setLicenseNum] = useState(
    data?.numeroLicencia ? data.numeroLicencia.replace(/\D/g, "") : "",
  );

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      setError(null);
      setSuccess(false);
      setSelectedSpecialties(currentEspecialidades);
      setLicenseNum(data?.numeroLicencia ? data.numeroLicencia.replace(/\D/g, "") : "");
    }
  };

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
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

    if (licenseNum.length < 4 || licenseNum.length > 5) {
      setError("El número de licencia debe tener entre 4 y 5 dígitos.");
      return;
    }

    const payload: VeterinarianRequest = {
      correo: formData.get("correo") as string,
      contrasenia: formData.get("contrasenia") as string,
      nombres: formData.get("nombres") as string,
      apellidos: formData.get("apellidos") as string,
      telefono,
      numeroLicencia: `CMVP N° ${licenseNum}`,
      especialidades: selectedSpecialties,
      habilitado: true,
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
                    <FieldLabel htmlFor="input-correo">Correo</FieldLabel>
                    <Input id="input-correo" name="correo" type="email" defaultValue={data?.usuario?.correo ?? ""} placeholder="Ej. vet@correo.com" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="input-contrasenia">Contraseña</FieldLabel>
                    <Input id="input-contrasenia" name="contrasenia" type="password" placeholder="••••••••" required />
                  </Field>
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
                      placeholder="Ej. Pérez Gómez"
                      required
                      onInput={(e) => {
                        const input = e.currentTarget;
                        input.value = input.value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, "");
                      }}
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
                    <FieldLabel htmlFor="input-license-num">N° Licencia</FieldLabel>
                    <div className="flex items-center rounded-lg border border-input bg-background px-3 py-1.5 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
                      {licenseNum && (
                        <span className="shrink-0 text-muted-foreground font-medium mr-1.5">CMVP N°</span>
                      )}
                      <input
                        id="input-license-num"
                        type="text"
                        inputMode="numeric"
                        placeholder={licenseNum ? "" : "CMVP N° 1234"}
                        value={licenseNum}
                        onChange={(e) =>
                          setLicenseNum(e.target.value.replace(/\D/g, "").slice(0, 5))
                        }
                        className="min-w-0 flex-1 bg-transparent outline-none"
                        required
                      />
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel>Especialidades</FieldLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-left focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {selectedSpecialties.length === 0 ? (
                            <span className="text-muted-foreground">Selecciona especialidades</span>
                          ) : (
                            <span>{selectedSpecialties.join(", ")}</span>
                          )}
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-64">
                        {SPECIALTIES.map((s) => (
                          <DropdownMenuCheckboxItem
                            key={s}
                            checked={selectedSpecialties.includes(s)}
                            onCheckedChange={() => toggleSpecialty(s)}
                            onSelect={(e) => e.preventDefault()}
                          >
                            {s}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
