"use client";

import { useCallback, useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, FileText, Lock, Save } from "lucide-react";

import { getMyOwner } from "@/services/owners/owners";
import { updatePassword } from "@/services/users/users";
import type { ClienteResponse } from "@/types/cliente";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

const PerfilPage = () => {
  const [owner, setOwner] = useState<ClienteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOwner(await getMyOwner());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar tu información.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(null);
    setSubmitError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const contraseniaActual = formData.get("contraseniaActual") as string;
    const nuevaContrasenia = formData.get("nuevaContrasenia") as string;

    if (!owner?.usuario?.idUsuario) return;

    setSubmitting(true);
    try {
      await updatePassword(owner.usuario.idUsuario, { contraseniaActual, nuevaContrasenia });
      setSuccess("Contraseña actualizada correctamente.");
      form.reset();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña.");
    } finally {
      setSubmitting(false);
    }
  };

  const initials = owner
    ? `${owner.nombres?.charAt(0) ?? ""}${owner.apellidos?.charAt(0) ?? ""}`.toUpperCase() || "US"
    : "US";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!owner) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Encabezado */}
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="bg-teal-100 text-base font-semibold text-teal-700 dark:bg-teal-900 dark:text-teal-300">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {owner.nombres} {owner.apellidos}
          </h1>
          <p className="text-sm text-muted-foreground">Tu información personal</p>
        </div>
      </div>

      {/* Datos personales */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-4 w-4 text-teal-600" />
            Datos personales
          </h2>
        </div>
        <div className="divide-y divide-border">
          <InfoRow icon={Mail} label="Correo" value={owner.usuario?.correo} />
          <InfoRow icon={Phone} label="Teléfono" value={owner.telefono} />
          <InfoRow icon={FileText} label="DNI" value={owner.dni} />
          <InfoRow icon={MapPin} label="Dirección" value={owner.direccion} />
        </div>
      </div>

      {/* Cambiar contraseña */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-teal-600" />
            Cambiar Contraseña
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="contrasenia-actual">Contraseña actual</FieldLabel>
              <Input id="contrasenia-actual" name="contraseniaActual" type="password" placeholder="••••••••" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="nueva-contrasenia">Nueva contraseña</FieldLabel>
              <Input id="nueva-contrasenia" name="nuevaContrasenia" type="password" placeholder="••••••••" required />
            </Field>
          </FieldGroup>

          {submitError && (
            <p className="text-sm font-medium text-destructive">{submitError}</p>
          )}
          {success && (
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{success}</p>
          )}

          <Button type="submit" disabled={submitting} className="gap-2">
            <Save className="h-4 w-4" />
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) => (
  <div className="flex items-center gap-3 px-5 py-3">
    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground truncate">{value ?? "—"}</p>
    </div>
  </div>
);

export default PerfilPage;
