"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Target,
  Eye,
  Award,
  HeartHandshake,
  Microscope,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const MANIFESTO_WORDS =
  "Healthy Pets nació en 2010 con una promesa inquebrantable: unir la precisión de la medicina clínica moderna con la calidez de una familia que ama y protege cada etapa de la vida de tu mascota.".split(
    " "
  );

const MILESTONES = [
  {
    year: "2010",
    title: "El Origen",
    desc: "Fundación en Lima por médicos veterinarios con vocación preventiva y trato humano.",
  },
  {
    year: "2016",
    title: "Quirófano & Lab HD",
    desc: "Incorporación de cirugía con anestesia inhalatoria y laboratorio propio en 15 minutos.",
  },
  {
    year: "2022",
    title: "Urgencias 24/7",
    desc: "Unidad de cuidados críticos continua los 365 días del año con monitoreo multiparamétrico.",
  },
  {
    year: "2026",
    title: "Ecosistema Digital",
    desc: "Más de 2,000 mascotas con historial clínico sincronizado y medicina predictiva.",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeMilestone, setActiveMilestone] = useState(3);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight * 0.4;
      const current = window.innerHeight * 0.85 - rect.top;
      const p = Math.max(0, Math.min(1, current / total));
      setScrollProgress(p);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white py-28 dark:bg-slate-950"
    >
      {/* Luz ambiental sutil */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl dark:bg-teal-500/15" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* PARTE 1: Apple Keynote Scroll-Scrubbed Manifesto (Palabra por palabra) */}
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
            <Sparkles className="h-3.5 w-3.5" />
            Nuestra Historia · Scroll Reveal
          </span>

          <p
            aria-label={MANIFESTO_WORDS.join(" ")}
            className="mt-8 flex flex-wrap justify-center gap-x-2.5 gap-y-2 text-2xl font-extrabold leading-[1.22] tracking-tight sm:text-4xl lg:text-5xl"
          >
            {MANIFESTO_WORDS.map((word, i) => {
              // Each word lights up sequentially between scrollProgress 0.05 and 0.52
              const wordThreshold = 0.04 + (i / MANIFESTO_WORDS.length) * 0.46;
              const delta = (scrollProgress - wordThreshold) * 14;
              const wordOpacity = Math.max(0.16, Math.min(1, delta));
              const isHighlighted =
                word.includes("2010") ||
                word.includes("precisión") ||
                word.includes("familia") ||
                word.includes("mascota.");

              return (
                <span
                  key={`${word}-${i}`}
                  style={{
                    opacity: wordOpacity,
                    transform: `translate3d(0, ${(1 - wordOpacity) * 8}px, 0)`,
                  }}
                  className={`transition-transform duration-150 ${
                    isHighlighted
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </p>
        </div>

        {/* PARTE 2: Línea de Tiempo Interactiva (Frames de Evolución 2010 - 2026) */}
        <div className="mt-16 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-6 backdrop-blur-xl sm:p-8 dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                CRONOLOGÍA INTERACTIVA
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                Un lugar donde tu mascota está en buenas manos
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {MILESTONES.map((m, idx) => (
                <button
                  key={m.year}
                  type="button"
                  onClick={() => setActiveMilestone(idx)}
                  className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-bold transition-all ${
                    activeMilestone === idx
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/25 dark:bg-teal-400 dark:text-slate-950"
                      : "bg-white text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {m.year}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MILESTONES.map((m, idx) => {
              const isSelected = activeMilestone === idx;
              return (
                <div
                  key={m.year}
                  onClick={() => setActiveMilestone(idx)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                    isSelected
                      ? " -translate-y-1 border-teal-500 bg-white shadow-xl shadow-teal-500/10 dark:border-teal-400 dark:bg-slate-900"
                      : "border-slate-200/70 bg-white/60 opacity-75 hover:opacity-100 dark:border-slate-800 dark:bg-slate-950/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-teal-600 dark:text-teal-400">
                      {m.year}
                    </span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isSelected
                          ? "bg-teal-500 ring-4 ring-teal-500/20"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    />
                  </div>
                  <h4 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                    {m.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* PARTE 3: Apple Bento Grid con Parallax Frames (Historia, Misión, Visión) */}
        <div
          onMouseMove={handleMouseMove}
          className="relative mt-10 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12"
        >
          {/* Bento Card Izquierda (7 cols): Historia + Equipo Colegiado */}
          <div
            style={{
              transform: `translate3d(0, ${(0.5 - scrollProgress) * 28}px, 0)`,
              backgroundImage: `radial-gradient(600px circle at ${spotlight.x}% ${spotlight.y}%, rgba(20, 184, 166, 0.09), transparent 60%)`,
            }}
            className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm transition-shadow hover:shadow-xl lg:col-span-7 sm:p-10 dark:border-slate-800 dark:bg-slate-900/90"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                <HeartHandshake className="h-4 w-4" />
                Vocación & Ciencia
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                Cercanos, honestos y con tecnología de vanguardia
              </h2>

              <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                <p>
                  Healthy Pets nació en 2010 de un grupo de veterinarios que
                  soñaban con una clínica distinta: cercana, honesta y con la
                  tecnología necesaria para cuidar de verdad a los animales.
                </p>
                <p>
                  Hoy acompañamos a miles de familias en cada etapa de la vida de
                  sus compañeros: desde la primera vacuna hasta los cuidados de
                  la vejez, siempre con el mismo trato humano con el que
                  empezamos.
                </p>
              </div>
            </div>

            {/* Pilares Clínicos */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
                <Microscope className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <p className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
                  Diagnóstico Propio
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Resultados al instante
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
                <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <p className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
                  Bioseguridad ISO
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ambientes esterilizados
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
                <Award className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <p className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
                  Staff Colegiado
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Formación continua
                </p>
              </div>
            </div>

            {/* Sello Equipo Colegiado */}
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-teal-200/70 bg-gradient-to-r from-teal-50/90 to-emerald-50/60 p-4 dark:border-teal-900/50 dark:from-teal-950/40 dark:to-slate-900">
              <Image
                className="rounded-full ring-2 ring-teal-400"
                src="/logovet2.jpg"
                alt="Healthy Pets"
                width={56}
                height={56}
              />
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white">
                  Equipo colegiado
                </span>{" "}
                y en formación continua para darte lo mejor en cada consulta.
              </p>
            </div>
          </div>

          {/* Columna Derecha (5 cols): Misión y Visión con Parallax Opuesto */}
          <div
            style={{
              transform: `translate3d(0, ${(scrollProgress - 0.5) * 28}px, 0)`,
            }}
            className="flex flex-col gap-6 lg:col-span-5"
          >
            {/* Misión Frame */}
            <div className="group relative flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/60 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-teal-500/10 blur-2xl transition-all duration-500 group-hover:bg-teal-500/25" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 transition-transform duration-300 group-hover:scale-110 dark:bg-teal-900/50 dark:text-teal-300">
                    <Target className="h-6 w-6" />
                  </span>
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                      PROPÓSITO CLÍNICO
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      Misión
                    </h3>
                  </div>
                </div>
                <span className="font-mono text-xs text-slate-400">01 / 02</span>
              </div>
              <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Brindar atención veterinaria integral, preventiva y
                especializada, promoviendo la salud y el bienestar de las
                mascotas con un servicio profesional, ético y humano.
              </p>
            </div>

            {/* Visión Frame */}
            <div className="group relative flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/60 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/25" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 transition-transform duration-300 group-hover:scale-110 dark:bg-teal-900/50 dark:text-teal-300">
                    <Eye className="h-6 w-6" />
                  </span>
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                      HORIZONTE FUTURO
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      Visión
                    </h3>
                  </div>
                </div>
                <span className="font-mono text-xs text-slate-400">02 / 02</span>
              </div>
              <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Ser la veterinaria referente de la ciudad, reconocida por la
                calidad de su atención, la innovación médica y el compromiso con
                el cuidado responsable de los animales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
