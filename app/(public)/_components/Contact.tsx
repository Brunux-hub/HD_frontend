"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CalendarCheck2,
  CheckCircle2,
  Sparkles,
  PawPrint,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const info = [
  { icon: MapPin, label: "Dirección", value: "Jr. La Esquina 1011, Lima, Perú" },
  { icon: Phone, label: "Teléfono", value: "+51 123 456 789" },
  { icon: Mail, label: "Correo", value: "contacto@healthypets.pe" },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun a Sáb · 8:00 – 20:00 · Urgencias 24/7",
  },
];

const PET_TYPES = ["Perro", "Gato", "Exótico"];
const VISIT_TYPES = ["Consulta Preventiva", "Especialidad", "Urgencia 24/7"];

export default function Contact() {
  const [ownerName, setOwnerName] = useState("");
  const [selectedPet, setSelectedPet] = useState("Perro");
  const [visitType, setVisitType] = useState("Consulta Preventiva");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contacto"
      className="relative w-full overflow-hidden bg-slate-50 py-28 dark:bg-slate-950"
    >
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Columna Izquierda (5 cols): Info + Live Apple Wallet Pass Preview */}
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
              <Sparkles className="h-3.5 w-3.5" />
              Contacto & Citas
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Hablemos sobre tu mascota
            </h2>
            <p className="mt-4 max-w-md text-base text-slate-600 dark:text-slate-300">
              Déjanos tus datos y te contactamos para coordinar la cita en el
              horario que mejor te acomode.
            </p>

            <ul className="mt-8 space-y-4">
              {info.map((item) => (
                <li
                  key={item.label}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white/80 p-3.5 shadow-xs backdrop-blur transition hover:border-teal-400/50 dark:border-slate-800/80 dark:bg-slate-900/70"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Apple Wallet Style Live Appointment Pass Preview */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 p-6 text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-teal-400" />
                <span className="font-mono text-xs font-bold tracking-wider text-teal-300">
                  HEALTHYPETS · SMART PASS
                </span>
              </div>
              <span className="rounded-full bg-teal-400/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-teal-200">
                VISTA PREVIA
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400">Titular</p>
                <p className="mt-0.5 truncate text-sm font-bold text-white">
                  {ownerName.trim() || "Tu nombre aquí"}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Paciente / Modalidad</p>
                <p className="mt-0.5 text-sm font-bold text-teal-300">
                  {selectedPet} · {visitType}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha (7 cols): Formulario Interactivo */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white p-8 shadow-xl sm:p-10 dark:border-slate-800 dark:bg-slate-900"
          >
            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-300">
                  <CheckCircle2 className="h-9 w-9" />
                </span>
                <h3 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">
                  ¡Solicitud registrada con éxito!
                </h3>
                <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
                  Hemos recibido los datos para tu{" "}
                  <strong className="text-teal-600 dark:text-teal-400">
                    {selectedPet}
                  </strong>{" "}
                  ({visitType}). Nuestro equipo se comunicará contigo en breve.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      Solicita tu cita
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Te respondemos en menos de 24 horas.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                    <CalendarCheck2 className="h-3.5 w-3.5" />
                    Agenda rápida
                  </span>
                </div>

                {/* Selectores Tipo Apple Pill */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Especie
                    </span>
                    <div className="flex gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
                      {PET_TYPES.map((pt) => (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => setSelectedPet(pt)}
                          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                            selectedPet === pt
                              ? "bg-white text-teal-700 shadow-xs dark:bg-teal-500 dark:text-slate-950"
                              : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
                          }`}
                        >
                          {pt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Prioridad
                    </span>
                    <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
                      {VISIT_TYPES.map((vt) => (
                        <button
                          key={vt}
                          type="button"
                          onClick={() => setVisitType(vt)}
                          className={`flex-1 truncate rounded-lg px-1.5 py-1.5 text-[11px] font-bold transition ${
                            visitType === vt
                              ? "bg-white text-teal-700 shadow-xs dark:bg-teal-500 dark:text-slate-950"
                              : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
                          }`}
                        >
                          {vt.replace("Consulta ", "")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Nombres y apellidos
                    </label>
                    <Input
                      id="name"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      autoComplete="off"
                      placeholder="Ej. María Torres"
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        Correo
                      </label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="off"
                        placeholder="tucorreo@email.com"
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        Teléfono
                      </label>
                      <Input
                        id="phone"
                        autoComplete="off"
                        placeholder="987 654 321"
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="serviceDescription"
                      className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      ¿Qué necesita tu mascota?
                    </label>
                    <Textarea
                      id="serviceDescription"
                      autoComplete="off"
                      placeholder="Cuéntanos brevemente el motivo de la consulta..."
                      className="min-h-28 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-600/25 transition hover:scale-[1.01] hover:shadow-xl hover:shadow-teal-600/35"
                  >
                    Enviar solicitud
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
