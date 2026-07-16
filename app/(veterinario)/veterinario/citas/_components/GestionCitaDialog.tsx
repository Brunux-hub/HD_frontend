"use client";

import { useState } from "react";
import { Minus, X, CheckCircle2, Loader2, ClipboardList, FileText } from "lucide-react";

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
import { Receta, RecetaRequest } from "@/types/receta";
import { ItemReceta, ItemRecetaRequest } from "@/types/itemReceta";
import { createRegistroMedico } from "@/services/registrosMedicos/registrosMedicos";
import { createReceta } from "@/services/recetas/recetas";
import { createItemReceta } from "@/services/itemsReceta/itemsReceta";

type Props = {
  cita: Appointment;
  open: boolean;
  onMinimize: () => void;
  onFinalizar: () => Promise<void> | void;
};

type Tab = "registro" | "recetas";

const GestionCitaDialog = ({ cita, open, onMinimize, onFinalizar }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>("registro");
  const [confirmClose, setConfirmClose] = useState(false);
  const [finalizando, setFinalizando] = useState(false);

  const [registroGuardado, setRegistroGuardado] = useState<RegistroMedico | null>(null);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [itemsPorReceta, setItemsPorReceta] = useState<Record<number, ItemReceta[]>>({});

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
    { key: "recetas", label: "Recetas", icon: FileText },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setConfirmClose(true); }}>
      <DialogContent className="max-w-2xl" showCloseButton={false} onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogTitle className="sr-only" />
        <DialogDescription className="sr-only" />

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

        <div className="max-h-[50vh] overflow-y-auto">
          {activeTab === "registro" && (
            <RegistroMedicoTab
              citaId={cita.idCita}
              registroGuardado={registroGuardado}
              onGuardado={(r) => setRegistroGuardado(r)}
            />
          )}
          {activeTab === "recetas" && (
            <RecetasTab
              registroMedicoId={registroGuardado?.idRegistroMedico ?? null}
              recetas={recetas}
              itemsPorReceta={itemsPorReceta}
              onAddReceta={(r) => setRecetas((prev) => [...prev, r])}
              onAddItem={(recetaId, item) =>
                setItemsPorReceta((prev) => ({
                  ...prev,
                  [recetaId]: [...(prev[recetaId] ?? []), item],
                }))
              }
            />
          )}
        </div>

        {confirmClose && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-slate-900">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">¿Finalizar la cita?</p>
              <p className="mt-2 text-sm text-slate-500">
                Al finalizar, la cita pasará a estado FINALIZADA y no podrá seguir editándola.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Button variant="outline" onClick={() => setConfirmClose(false)} disabled={finalizando}>
                  No, seguir editando
                </Button>
                <Button variant="destructive" onClick={handleConfirmFinalizar} disabled={finalizando}>
                  {finalizando ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Finalizando...</>
                  ) : "Sí, finalizar"}
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const payload: RegistroMedicoRequest = {
      idCita: citaId,
      diagnostico: formData.get("diagnostico") as string,
      peso: Number(formData.get("peso")),
      observaciones: formData.get("observaciones") as string,
    };
    setSubmitting(true);
    try {
      const reg = await createRegistroMedico(payload);
      onGuardado({ ...reg, peso: payload.peso });
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
          <span className="font-medium">Registro médico guardado</span>
        </div>
        <div className="rounded-lg border border-teal-100 bg-teal-50 p-4 text-sm dark:border-teal-900/40 dark:bg-teal-950/30">
          <p><strong>Diagnóstico:</strong> {registroGuardado.diagnostico}</p>
          <p><strong>Peso:</strong> {registroGuardado.peso ?? "—"}</p>
          <p><strong>Observaciones:</strong> {registroGuardado.observaciones}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <Field>
        <FieldLabel htmlFor="peso">Peso (kg)</FieldLabel>
        <Input id="peso" name="peso" type="number" step="0.1" min="0" placeholder="Ej. 28.5" required />
      </Field>
      <Field>
        <FieldLabel htmlFor="diagnostico">Diagnóstico</FieldLabel>
        <Textarea id="diagnostico" name="diagnostico" required className="resize-none" placeholder="Describe el diagnóstico" />
      </Field>
      <Field>
        <FieldLabel htmlFor="observaciones">Observaciones</FieldLabel>
        <Textarea id="observaciones" name="observaciones" className="resize-none" placeholder="Observaciones adicionales" />
      </Field>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
        ) : "Guardar registro médico"}
      </Button>
    </form>
  );
};

// --- Tab: Recetas ---
const RecetasTab = ({
  registroMedicoId,
  recetas,
  itemsPorReceta,
  onAddReceta,
  onAddItem,
}: {
  registroMedicoId: number | null;
  recetas: Receta[];
  itemsPorReceta: Record<number, ItemReceta[]>;
  onAddReceta: (r: Receta) => void;
  onAddItem: (recetaId: number, item: ItemReceta) => void;
}) => {
  const [submittingReceta, setSubmittingReceta] = useState(false);
  const [submittingItem, setSubmittingItem] = useState(false);
  const [selectedRecetaId, setSelectedRecetaId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCrearReceta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (registroMedicoId == null) {
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
      onAddReceta(r);
      setSelectedRecetaId(r.idReceta);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la receta.");
    } finally {
      setSubmittingReceta(false);
    }
  };

  const handleAgregarItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!selectedRecetaId) return;
    const formData = new FormData(e.currentTarget);
    const payload: ItemRecetaRequest = {
      idReceta: selectedRecetaId,
      medicamento: formData.get("itemMedicamento") as string,
      cantidad: formData.get("itemCantidad") as string,
      dosis: formData.get("itemDosis") as string,
      indicaciones: formData.get("itemIndicaciones") as string,
    };
    setSubmittingItem(true);
    try {
      const item = await createItemReceta(payload);
      onAddItem(selectedRecetaId, item);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo agregar el ítem.");
    } finally {
      setSubmittingItem(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      {registroMedicoId == null && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
          Debes guardar un registro médico antes de crear recetas.
        </p>
      )}

      {/* Crear nueva receta */}
      <form onSubmit={handleCrearReceta} className="space-y-3">
        <Field>
          <FieldLabel htmlFor="numeroReceta">Número de receta</FieldLabel>
          <Input id="numeroReceta" name="numeroReceta" required placeholder="Ej. REC-001" disabled={registroMedicoId == null} />
        </Field>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <Button type="submit" disabled={submittingReceta || registroMedicoId == null}>
          {submittingReceta ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Creando...</>
          ) : "Crear receta"}
        </Button>
      </form>

      {/* Lista de recetas */}
      {recetas.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recetas creadas:</p>
          <div className="flex flex-wrap gap-2">
            {recetas.map((r) => (
              <button
                key={r.idReceta}
                onClick={() => setSelectedRecetaId(r.idReceta)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  selectedRecetaId === r.idReceta
                    ? "bg-teal-600 text-white"
                    : "bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950/30 dark:text-teal-300"
                }`}
              >
                Receta #{r.numeroReceta}
              </button>
            ))}
          </div>

          {selectedRecetaId && (
            <div className="space-y-3 rounded-lg border border-teal-100 bg-teal-50/50 p-4 dark:border-teal-900/40 dark:bg-teal-950/20">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Ítems de Receta #{recetas.find((r) => r.idReceta === selectedRecetaId)?.numeroReceta}
              </p>

              {/* Items existentes */}
              {(itemsPorReceta[selectedRecetaId] ?? []).length > 0 && (
                <div className="space-y-2">
                  {(itemsPorReceta[selectedRecetaId] ?? []).map((item) => (
                    <div key={item.idItemReceta} className="rounded-lg border border-teal-100 bg-white p-3 text-sm dark:border-teal-900/40 dark:bg-slate-900">
                      <p><strong>{item.medicamento}</strong> — Cantidad: {item.cantidad} · Dosis: {item.dosis}</p>
                      {item.indicaciones && <p className="text-xs text-slate-500">Indicaciones: {item.indicaciones}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Agregar item */}
              <form onSubmit={handleAgregarItem} className="space-y-3">
                <p className="text-xs font-semibold text-slate-500">Agregar ítem:</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="itemMedicamento">Medicamento</FieldLabel>
                    <Input id="itemMedicamento" name="itemMedicamento" required placeholder="Ej. Paracetamol" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="itemCantidad">Cantidad</FieldLabel>
                    <Input id="itemCantidad" name="itemCantidad" required placeholder="Ej. 10 tabletas" />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="itemDosis">Dosis</FieldLabel>
                  <Input id="itemDosis" name="itemDosis" required placeholder="Ej. 1 tableta cada 8h" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="itemIndicaciones">Indicaciones</FieldLabel>
                  <Input id="itemIndicaciones" name="itemIndicaciones" placeholder="Ej. Con alimentos" />
                </Field>
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <Button type="submit" disabled={submittingItem}>
                  {submittingItem ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Agregando...</>
                  ) : "Agregar ítem"}
                </Button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GestionCitaDialog;