"use client";

import { useCallback, useEffect, useState } from "react";

import { RegistroMedico } from "@/types/registroMedico";
import { getRegistrosMedicos } from "@/services/registrosMedicos/registrosMedicos";
import VerMasDialog from "./_components/VerMasDialog";

const fmtDate = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso.slice(0, 16));
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const VeterinarioHistorialPage = () => {
  const [registros, setRegistros] = useState<RegistroMedico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verMasRegistro, setVerMasRegistro] = useState<RegistroMedico | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRegistros(await getRegistrosMedicos());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los registros.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Historial Médico</h1>
        <p className="text-sm text-slate-500">Revisa todos los registros médicos.</p>
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando registros...</p>
      ) : registros.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay registros médicos.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-teal-100 bg-card shadow-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-teal-100">
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Cita</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Diagnóstico</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.idRegistroMedico} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">#{r.idCita}</td>
                  <td className="px-4 py-3">{fmtDate(r.fecha)}</td>
                  <td className="px-4 py-3">{r.diagnostico}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setVerMasRegistro(r)}
                      className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
                    >
                      Ver más
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {verMasRegistro && (
        <VerMasDialog registro={verMasRegistro} onClose={() => setVerMasRegistro(null)} />
      )}
    </div>
  );
};

export default VeterinarioHistorialPage;