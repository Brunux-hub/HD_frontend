"use client";

import type { Appointment } from "@/types/appointment";
import type { Pet } from "@/types/pet";
import type { Service } from "@/types/service";

type PrintReceiptParams = {
  appointment: Appointment;
  pet?: Pet;
  service?: Service;
};

const escapeHtml = (value: unknown) =>
  String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatDateTime = (iso?: string) => {
  if (!iso) return "—";

  const date = new Date(iso.slice(0, 16));
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

const formatCurrency = (amount?: number) => {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "—";

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(amount);
};

export function printReceipt({
  appointment,
  pet,
  service,
}: PrintReceiptParams) {
  const printWindow = window.open("", "_blank", "width=960,height=1200");

  if (!printWindow) {
    throw new Error("No se pudo abrir la ventana de impresión.");
  }

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Recibo de servicio</title>
        <style>
          :root {
            color-scheme: light;
            --sky-700: #0369a1;
            --sky-600: #0284c7;
            --sky-100: #dbeafe;
            --sky-50: #eff6ff;
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
            background: #edf6fb;
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
            display: block;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--sky-100);
          }

          .brand-chip {
            display: inline-block;
            margin-bottom: 12px;
            padding: 6px 12px;
            border-radius: 999px;
            background: var(--sky-50);
            color: var(--sky-700);
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

          .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            margin-top: 18px;
          }

          .panel {
            padding: 18px;
            border: 1px solid var(--slate-300);
            border-radius: 18px;
            background: #fcfeff;
          }

          .panel-wide {
            margin-top: 16px;
            padding: 20px;
            border: 1px solid var(--slate-300);
            border-radius: 18px;
            background: var(--sky-50);
          }

          .panel-title {
            margin: 0 0 14px;
            color: var(--sky-700);
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

          .service-name {
            margin: 0 0 10px;
            font-size: 24px;
          }

          .service-description {
            margin: 0;
            color: var(--slate-700);
            font-size: 14px;
            line-height: 1.6;
          }

          .total-box {
            margin-top: 18px;
            display: flex;
            justify-content: flex-end;
          }

          .total-card {
            min-width: 240px;
            padding: 18px 20px;
            border-radius: 18px;
            background: var(--sky-100);
            color: var(--slate-900);
            text-align: right;
          }

          .total-card span {
            display: block;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            opacity: 1;
          }

          .total-card strong {
            display: block;
            margin-top: 8px;
            font-size: 28px;
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
              <h1>Recibo de servicio</h1>
            </div>
          </header>

          <section class="grid">
            <div class="panel">
              <h2 class="panel-title">Datos de la mascota</h2>
              <div class="meta">
                <div class="meta-row">
                  <strong>Mascota</strong>
                  <span>${escapeHtml(pet?.nombre)}</span>
                </div>
                <div class="meta-row">
                  <strong>Especie</strong>
                  <span>${escapeHtml(pet?.especie)}</span>
                </div>
                <div class="meta-row">
                  <strong>Raza</strong>
                  <span>${escapeHtml(pet?.raza)}</span>
                </div>
              </div>
            </div>
            <div class="panel">
              <h2 class="panel-title">Datos de la atención</h2>
              <div class="meta">
                <div class="meta-row">
                  <strong>Fecha</strong>
                  <span>${escapeHtml(formatDateTime(appointment.fechaProgramada))}</span>
                </div>
                <div class="meta-row">
                  <strong>Estado</strong>
                  <span>${escapeHtml(appointment.estado)}</span>
                </div>
                <div class="meta-row">
                  <strong>Motivo</strong>
                  <span>${escapeHtml(appointment.motivo)}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="panel-wide">
            <h2 class="panel-title">Detalle del servicio</h2>
            <h3 class="service-name">${escapeHtml(service?.nombre)}</h3>
            <p class="service-description">${escapeHtml(service?.descripcion)}</p>
          </section>

          <div class="total-box">
            <div class="total-card">
              <span>Total</span>
              <strong>${escapeHtml(formatCurrency(service?.precio))}</strong>
            </div>
          </div>
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
