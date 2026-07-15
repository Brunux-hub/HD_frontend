"use client";

import { useState } from "react";
import { Minus, X, CheckCircle2, Loader2, ClipboardList, Pill, FileText } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Appointment } from "@/types/appointment";
import { RegistroMedico, RegistroMedicoRequest } from "@/types/registroMedico";
import { Tratamiento, TratamientoRequest } from "@/types/tratamiento";
import { Receta, RecetaRequest } from "@/types/receta";
import { ItemReceta, ItemRecetaRequest } from "@/types/itemReceta";
import { createRegistroMedico } from "@/services/registrosMedicos/registrosMedicos";
import { createTratamiento } from "@/services/tratamientos/tratamientos";
import { createReceta } from "@/services/recetas/recetas";
import { createItemReceta } from "@/services/itemsReceta/itemsReceta";

type Props = {
  cita: Appointment;
  open: boolean;
  onMinimize: () => void;
  onFinalizar: () => Promise<void> | void;
};

type Tab = "registro" | "tratamientos" | "recetas";

const GestionCitaDialog = ({ cita, open, onMinimize, onFinalizar }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>("registro");
  const [confirmClose, setConfirmClose] = useState(false);
  const [finalizando, setFinalizando] = useState(false);

  const [registroGuardado, setRegistroGuardado] = useState<RegistroMedico | null>(null);
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [recetaGuardada, setRecetaGuardada] = useState<Receta | null>(null);
  const [itemsReceta, setItemsReceta] = useState<ItemReceta[]>([]);

  const handleConfirmFinalizar = async () => {
    setFinalizando(true);
    try {
      await onFinalizar();
    } finally {
      setFinalizando(false);
      setConfirmClose(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: typeof ClipboardList }[] = [
    { key: "registro", label: "Registro Médico", icon: ClipboardList },
    { key: "tratamientos", label: "Tratamientos", icon: Pill },
    { key: "recetas", label: "Recetas", icon: FileText },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setConfirmClose(true); }}>
      <DialogContent className="max-w-2xl" showCloseButton={false} onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogTitle className="sr-only" />
        <DialogDescription className="sr-only" />

        {/* Header con botones - y X */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Gestión de Cita #{cita.idCita}
            </h2>
            <p className="text-xs text-slate-500">{cita.motivo}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onMinimize}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Minimizar"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={() => setConfirmClose(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              title="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "border-b-2 border-teal-600 text-teal-600"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="max-h-[50vh] overflow-y-auto">
          {activeTab === "registro" && (
            <RegistroMedicoTab
              citaId={cita.idCita}
              registroGuardado={registroGuardado}
              onGuardado={(r) => setRegistroGuardado(r)}
            />
          )}
          {activeTab === "tratamientos" && (
            <TratamientosTab
              registroMedicoId={registroGuardado?.idRegistroMedico ?? null}
              tratamientos={tratamientos}
              onAdd={(t) => setTratamientos((prev) => [...prev, t])}
            />
          )}
          {activeTab === "recetas" && (
            <RecetasTab
              registroMedicoId={registroGuardado?.idRegistroMedico ?? null}
              recetas={recetas}
              recetaGuardada={recetaGuardada}
              itemsReceta={itemsReceta}
              onRecetaGuardada={(r) => setRecetaGuardada(r)}
              onAddReceta={(r) => setRecetas((prev) => [...prev, r])}
              onAddItem={(item) => setItemsReceta((prev) => [...prev, item])}
            />
          )}
        </div>

        {/* Confirmación de cierre */}
        {confirmClose && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-slate-900">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">¿Finalizar la cita?</p>
              <p className="mt-2 text-sm text-slate-500">
                Al finalizar, la cita pasará a estado FINALIZADA y no podrá seguir editándola.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmClose(false)}
                  disabled={finalizando}
                >
                  No, seguir editando
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmFinalizar}
                  disabled={finalizando}
                >
                  {finalizando ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Finalizando...
                    </>
                  ) : (
                    "Sí, finalizar"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// --- Tab: Registro Médico ---
const RegistroMedicoTab = ({
  citaId,
  registroGuardado,
  onGuardado,
}: {
  citaId: number;
  registroGuardado: RegistroMedico | null;
  onGuardado: (r: RegistroMedico) => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const payload: RegistroMedicoRequest = {
      idCita: citaId,
      diagnostico: formData.get("diagnostico") as string,
      medicamentosRecetados: formData.get("medicamentosRecetados") as string,
      observaciones: formData.get("observaciones") as string,
    };
    setSubmitting(true);
    try {
      const reg = await createRegistroMedico(payload);
      onGuardado(reg);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el registro.");
    } finally {
      setSubmitting(false);
    }
  };

  if (registroGuardado) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Registro médico guardado correctamente</span>
        </div>
        <div className="rounded-lg border border-teal-100 bg-teal-50 p-4 text-sm dark:border-teal-900/40 dark:bg-teal-950/30">
          <p><strong>Diagnóstico:</strong> {registroGuardado.diagnostico}</p>
          <p><strong>Medicamentos recetados:</strong> {registroGuardado.medicamentosRecetados}</p>
          <p><strong>Observaciones:</strong> {registroGuardado.observaciones}</p>
          <p><strong>Fecha:</strong> {registroGuardado.fecha?.slice(0, 16).replace("T", " ")}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <Field>
        <FieldLabel htmlFor="diagnostico">Diagnóstico</FieldLabel>
        <Textarea id="diagnostico" name="diagnostico" required className="resize-none" placeholder="Describe el diagnóstico" />
      </Field>
      <Field>
        <FieldLabel htmlFor="medicamentosRecetados">Medicamentos recetados</FieldLabel>
        <Textarea id="medicamentosRecetados" name="medicamentosRecetados" required className="resize-none" placeholder="Lista de medicamentos" />
      </Field>
      <Field>
        <FieldLabel htmlFor="observaciones">Observaciones</FieldLabel>
        <Textarea id="observaciones" name="observaciones" required className="resize-none" placeholder="Observaciones adicionales" />
      </Field>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      {success && <p className="text-sm font-medium text-green-600">¡Guardado!</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar registro médico"
        )}
      </Button>
    </form>
  );
};

// --- Tab: Tratamientos ---
const TratamientosTab = ({
  registroMedicoId,
  tratamientos,
  onAdd,
}: {
  registroMedicoId: number | null;
  tratamientos: Tratamiento[];
  onAdd: (t: Tratamiento) => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!registroMedicoId) {
      setError("Primero guarda un registro médico en el primer tab.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const payload: TratamientoRequest = {
      idRegistroMedico: registroMedicoId,
      medicamento: formData.get("medicamento") as string,
      dosis: formData.get("dosis") as string,
      frecuencia: formData.get("frecuencia") as string,
      duracion: formData.get("duracion") as string,
      indicaciones: formData.get("indicaciones") as string,
    };
    setSubmitting(true);
    try {
      const t = await createTratamiento(payload);
      onAdd(t);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el tratamiento.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      {tratamientos.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tratamientos guardados:</p>
          {tratamientos.map((t) => (
            <div key={t.idTratamiento} className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm dark:border-teal-900/40 dark:bg-teal-950/30">
              <p><strong>{t.medicamento}</strong> — {t.dosis}</p>
              <p className="text-xs text-slate-500">Frecuencia: {t.frecuencia} · Duración: {t.duracion}</p>
              {t.indicaciones && <p className="text-xs text-slate-500">Indicaciones: {t.indicaciones}</p>}
            </div>
          ))}
        </div>
      )}
      {!registroMedicoId && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
          Debes guardar un registro médico antes de agregar tratamientos.
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Field>
          <FieldLabel htmlFor="medicamento">Medicamento</FieldLabel>
          <Input id="medicamento" name="medicamento" required placeholder="Ej. Amoxicilina" disabled={!registroMedicoId} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="dosis">Dosis</FieldLabel>
            <Input id="dosis" name="dosis" required placeholder="Ej. 500mg" disabled={!registroMedicoId} />
          </Field>
          <Field>
            <FieldLabel htmlFor="frecuencia">Frecuencia</FieldLabel>
            <Input id="frecuencia" name="frecuencia" required placeholder="Ej. Cada 8 horas" disabled={!registroMedicoId} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="duracion">Duración</FieldLabel>
            <Input id="duracion" name="duracion" required placeholder="Ej. 7 días" disabled={!registroMedicoId} />
          </Field>
          <Field>
            <FieldLabel htmlFor="indicaciones">Indicaciones</FieldLabel>
            <Input id="indicaciones" name="indicaciones" placeholder="Ej. Con alimentos" disabled={!registroMedicoId} />
          </Field>
        </div>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <Button type="submit" disabled={submitting || !registroMedicoId}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar tratamiento"
          )}
        </Button>
      </form>
    </div>
  );
};

// --- Tab: Recetas ---
const RecetasTab = ({
  registroMedicoId,
  recetas,
  recetaGuardada,
  itemsReceta,
  onRecetaGuardada,
  onAddReceta,
  onAddItem,
}: {
  registroMedicoId: number | null;
  recetas: Receta[];
  recetaGuardada: Receta | null;
  itemsReceta: ItemReceta[];
  onRecetaGuardada: (r: Receta) => void;
  onAddReceta: (r: Receta) => void;
  onAddItem: (item: ItemReceta) => void;
}) => {
  const [submittingReceta, setSubmittingReceta] = useState(false);
  const [submittingItem, setSubmittingItem] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCrearReceta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!registroMedicoId) {
      setError("Primero guarda un registro médico.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const payload: RecetaRequest = {
      idRegistroMedico: registroMedicoId,
      numeroReceta: formData.get("numeroReceta") as string,
    };
    setSubmittingReceta(true);
    try {
      const r = await createReceta(payload);
      onRecetaGuardada(r);
      onAddReceta(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la receta.");
    } finally {
      setSubmittingReceta(false);
    }
  };

  const handleAgregarItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!recetaGuardada) return;
    const formData = new FormData(e.currentTarget);
    const payload: ItemRecetaRequest = {
      idReceta: recetaGuardada.idReceta,
      medicamento: formData.get("itemMedicamento") as string,
      cantidad: formData.get("itemCantidad") as string,
      dosis: formData.get("itemDosis") as string,
      indicaciones: formData.get("itemIndicaciones") as string,
    };
    setSubmittingItem(true);
    try {
      const item = await createItemReceta(payload);
      onAddItem(item);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo agregar el ítem.");
    } finally {
      setSubmittingItem(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      {recetas.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recetas creadas:</p>
          {recetas.map((r) => (
            <div key={r.idReceta} className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm dark:border-teal-900/40 dark:bg-teal-950/30">
              <p><strong>Receta #{r.numeroReceta}</strong> — {r.fechaEmision?.slice(0, 10)}</p>
            </div>
          ))}
        </div>
      )}
      {!registroMedicoId && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
          Debes guardar un registro médico antes de crear recetas.
        </p>
      )}
      {!recetaGuardada ? (
        <form onSubmit={handleCrearReceta} className="space-y-3">
          <Field>
            <FieldLabel htmlFor="numeroReceta">Número de receta</FieldLabel>
            <Input id="numeroReceta" name="numeroReceta" required placeholder="Ej. REC-001" disabled={!registroMedicoId} />
          </Field>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" disabled={submittingReceta || !registroMedicoId}>
            {submittingReceta ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear receta"
            )}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Receta #{recetaGuardada.numeroReceta} creada</span>
          </div>

          {itemsReceta.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ítems agregados:</p>
              {itemsReceta.map((item) => (
                <div key={item.idItemReceta} className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm dark:border-teal-900/40 dark:bg-teal-950/30">
                  <p><strong>{item.medicamento}</strong> — Cantidad: {item.cantidad} · Dosis: {item.dosis}</p>
                  {item.indicaciones && <p className="text-xs text-slate-500">Indicaciones: {item.indicaciones}</p>}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAgregarItem} className="space-y-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Agregar ítem a la receta:</p>
            <Field>
              <FieldLabel htmlFor="itemMedicamento">Medicamento</FieldLabel>
              <Input id="itemMedicamento" name="itemMedicamento" required placeholder="Ej. Paracetamol" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="itemCantidad">Cantidad</FieldLabel>
                <Input id="itemCantidad" name="itemCantidad" required placeholder="Ej. 10 tabletas" />
              </Field>
              <Field>
                <FieldLabel htmlFor="itemDosis">Dosis</FieldLabel>
                <Input id="itemDosis" name="itemDosis" required placeholder="Ej. 1 tableta cada 8h" />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="itemIndicaciones">Indicaciones</FieldLabel>
              <Input id="itemIndicaciones" name="itemIndicaciones" placeholder="Ej. Con alimentos" />
            </Field>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" disabled={submittingItem}>
              {submittingItem ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Agregando...
                </>
              ) : (
                "Agregar ítem"
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GestionCitaDialog;