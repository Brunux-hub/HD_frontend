"use client";

import { useEffect, useState } from "react";
import { X, ClipboardList, FileText, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { RegistroMedico } from "@/types/registroMedico";
import { Receta } from "@/types/receta";
import { ItemReceta } from "@/types/itemReceta";
import { getRecetasByRegistro } from "@/services/registrosMedicos/registrosMedicos";
import { getItemsByReceta } from "@/services/recetas/recetas";

type Props = {
  registro: RegistroMedico;
  onClose: () => void;
};

type Tab = "registro" | "recetas";

const fmtDate = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso.slice(0, 16));
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

const VerMasDialog = ({ registro, onClose }: Props) => {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("registro");
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [itemsPorReceta, setItemsPorReceta] = useState<Record<number, ItemReceta[]>>({});
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<number | null>(null);
  const [loadingDetalles, setLoadingDetalles] = useState(false);

  const cargarRecetas = async () => {
    setLoadingDetalles(true);
    try {
      const recs = await getRecetasByRegistro(registro.idRegistroMedico);
      setRecetas(recs);
      if (recs.length > 0) {
        const itemsMap: Record<number, ItemReceta[]> = {};
        for (const r of recs) {
          itemsMap[r.idReceta] = await getItemsByReceta(r.idReceta).catch(() => []);
        }
        setItemsPorReceta(itemsMap);
        setRecetaSeleccionada(recs[0].idReceta);
      }
    } catch {
      setRecetas([]);
    } finally {
      setLoadingDetalles(false);
    }
  };

  useEffect(() => {
    if (activeTab === "recetas" && recetas.length === 0) {
      cargarRecetas();
    }
  }, [activeTab]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const tabs: { key: Tab; label: string; icon: typeof ClipboardList }[] = [
    { key: "registro", label: "Registro Médico", icon: ClipboardList },
    { key: "recetas", label: "Recetas", icon: FileText },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-2xl" showCloseButton={false} onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogTitle className="sr-only" />
        <DialogDescription className="sr-only" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Registro Médico #{registro.idRegistroMedico}
            </h2>
            <p className="text-xs text-slate-500">Cita #{registro.idCita} · {fmtDate(registro.fecha)}</p>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <X className="h-4 w-4" />
          </button>
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
            <div className="space-y-3 p-4 text-sm">
              <div>
                <p className="text-xs text-slate-400">Diagnóstico</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">{registro.diagnostico}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Observaciones</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">{registro.observaciones}</p>
              </div>
            </div>
          )}

          {activeTab === "recetas" && (
            <div className="p-4">
              {loadingDetalles ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                </div>
              ) : recetas.length === 0 ? (
                <p className="text-sm text-slate-500">No hay recetas registradas.</p>
              ) : (
                <div className="space-y-4">
                  {/* Selector de receta */}
                  <div className="flex flex-wrap gap-2">
                    {recetas.map((r) => (
                      <button
                        key={r.idReceta}
                        onClick={() => setRecetaSeleccionada(r.idReceta)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          recetaSeleccionada === r.idReceta
                            ? "bg-teal-600 text-white"
                            : "bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950/30 dark:text-teal-300"
                        }`}
                      >
                        Receta #{r.numeroReceta}
                      </button>
                    ))}
                  </div>

                  {/* Ítems de la receta seleccionada */}
                  {recetaSeleccionada && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Ítems de la receta #{recetas.find((r) => r.idReceta === recetaSeleccionada)?.numeroReceta}
                      </p>
                      {(itemsPorReceta[recetaSeleccionada] ?? []).length === 0 ? (
                        <p className="text-sm text-slate-500">Sin ítems.</p>
                      ) : (
                        (itemsPorReceta[recetaSeleccionada] ?? []).map((item) => (
                          <div key={item.idItemReceta} className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm dark:border-teal-900/40 dark:bg-teal-950/30">
                            <p><strong>{item.medicamento}</strong> — Cantidad: {item.cantidad} · Dosis: {item.dosis}</p>
                            {item.indicaciones && <p className="text-xs text-slate-500">Indicaciones: {item.indicaciones}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerMasDialog;