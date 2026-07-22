"use client";

import type { ItemReceta } from "@/types/itemReceta";
import type { Receta } from "@/types/receta";
import type { RegistroMedico } from "@/types/registroMedico";

type PrintPrescriptionParams = {
  receta: Receta;
  items: ItemReceta[];
  registro: RegistroMedico;
  veterinarianName?: string;
};

const escapeHtml = (value: unknown) =>
  String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export function printPrescription({
  receta,
  items,
  registro,
  veterinarianName,
}: PrintPrescriptionParams) {
  const printWindow = window.open(
    "",
    "_blank",
    "width=960,height=1200",
  );

  if (!printWindow) {
    throw new Error("No se pudo abrir la ventana de impresión.");
  }

  const itemsHtml = items.length
    ? items
        .map(
          (item, index) => `
            <section class="item-card">
              <div class="item-header">
                <span class="item-index">Medicamento ${index + 1}</span>
              </div>
              <h3>${escapeHtml(item.medicamento)}</h3>
              <p><strong>Cantidad:</strong> ${escapeHtml(item.cantidad)}</p>
              <p><strong>Dosis:</strong> ${escapeHtml(item.dosis)}</p>
              <p><strong>Indicaciones:</strong> ${escapeHtml(item.indicaciones || "Sin indicaciones adicionales")}</p>
            </section>
          `,
        )
        .join("")
    : `<p class="empty-state">No hay ítems registrados para esta receta.</p>`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Receta ${escapeHtml(receta.numeroReceta)}</title>
        <style>
          :root {
            color-scheme: light;
            --teal-700: #0f766e;
            --teal-600: #0d9488;
            --teal-100: #ccfbf1;
            --teal-50: #f0fdfa;
            --slate-900: #0f172a;
            --slate-700: #334155;
            --slate-500: #64748b;
            --slate-300: #cbd5e1;
            --white: #ffffff;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #eef6f5;
            color: var(--slate-900);
            font-family: Arial, Helvetica, sans-serif;
          }

          .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 20mm 18mm;
            background: var(--white);
          }

          .header {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            align-items: flex-start;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--teal-100);
          }

          .brand-chip {
            display: inline-block;
            margin-bottom: 12px;
            padding: 6px 12px;
            border-radius: 999px;
            background: var(--teal-50);
            color: var(--teal-700);
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
          }

          h1 {
            margin: 0;
            font-size: 30px;
            line-height: 1.1;
          }

          .folio {
            min-width: 220px;
            padding: 18px;
            border-radius: 18px;
            background: linear-gradient(135deg, var(--teal-600), var(--teal-700));
            color: var(--white);
          }

          .folio-label {
            font-size: 11px;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .folio-value {
            display: block;
            margin-top: 8px;
            font-size: 24px;
            font-weight: 800;
          }

          .panel {
            padding: 18px;
            border: 1px solid var(--slate-300);
            border-radius: 18px;
            background: #fcfffe;
            margin-top: 14px;
          }

          .panel-title {
            margin: 0 0 14px;
            color: var(--teal-700);
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .meta {
            display: grid;
            gap: 10px;
          }

          .meta-row strong {
            display: block;
            margin-bottom: 4px;
            color: var(--slate-500);
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
          }

          .meta-row span {
            font-size: 14px;
            line-height: 1.45;
          }

          .section-title {
            margin: 28px 0 12px;
            font-size: 18px;
          }

          .items {
            display: grid;
            gap: 14px;
          }

          .item-card {
            padding: 18px;
            border: 1px solid var(--teal-100);
            border-radius: 18px;
            background: var(--teal-50);
          }

          .item-header {
            margin-bottom: 8px;
          }

          .item-index {
            color: var(--teal-700);
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .item-card h3 {
            margin: 0 0 10px;
            font-size: 20px;
          }

          .item-card p {
            margin: 6px 0 0;
            color: var(--slate-700);
            font-size: 14px;
            line-height: 1.5;
          }

          .footer {
            display: flex;
            justify-content: center;
            margin-top: 96px;
          }

          .signature {
            width: 240px;
            padding-top: 20px;
            border-top: 1px solid var(--slate-300);
            text-align: center;
          }

          .signature strong {
            display: block;
            font-size: 14px;
          }

          .signature span {
            display: block;
            margin-top: 4px;
            color: var(--slate-500);
            font-size: 12px;
          }

          .empty-state {
            margin: 0;
            color: var(--slate-500);
            font-size: 14px;
          }

          @media print {
            body {
              background: var(--white);
            }

            .page {
              width: auto;
              min-height: auto;
              margin: 0;
              padding: 12mm;
            }
          }
        </style>
      </head>
      <body>
        <main class="page">
          <header class="header">
            <div>
              <span class="brand-chip">Healthy Pets</span>
              <h1>Receta médica veterinaria</h1>
            </div>
            <div class="folio">
              <span class="folio-label">Número de receta</span>
              <span class="folio-value">${escapeHtml(receta.numeroReceta)}</span>
            </div>
          </header>

          <section class="panel">
            <h2 class="panel-title">Diagnóstico y observaciones</h2>
            <div class="meta">
              <div class="meta-row">
                <strong>Diagnóstico</strong>
                <span>${escapeHtml(registro.diagnostico || "Sin diagnóstico registrado")}</span>
              </div>
              <div class="meta-row">
                <strong>Observaciones</strong>
                <span>${escapeHtml(registro.observaciones || "Sin observaciones registradas")}</span>
              </div>
            </div>
          </section>

          <h2 class="section-title">Indicaciones</h2>
          <section class="items">
            ${itemsHtml}
          </section>

          <footer class="footer">
            <div class="signature">
              <strong>Firma y sello</strong>
              <span>${escapeHtml(veterinarianName || "Médico veterinario responsable")}</span>
            </div>
          </footer>
        </main>
        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
            }, 250);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
