"use client";

import React, { useEffect, useRef, useState } from "react";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { FaWhatsapp } from "react-icons/fa6";
import {
  Film,
  LayoutGrid,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import servicios from "@/data/vetServicios.json";

const PROTOCOL_SPECS: Record<number, string[]> = {
  1: ["Evaluación de 12 sistemas", "Control de peso y nutrición", "Carnet digital incluido"],
  2: ["Anestesia inhalatoria segura", "Monitoreo multiparamétrico", "Quirófano esterilizado"],
  3: ["Cadena de frío certificada", "Recordatorios automáticos", "Antiparasitarios de amplio espectro"],
  4: ["Hemograma en 15 minutos", "Bioquímica sanguínea y orina", "Citología y microscopía HD"],
  5: ["Profilaxis por ultrasonido", "Pulido dental sin dolor", "Prevención periodontal"],
  6: ["Médico de guardia 24/7", "Oxigenoterapia y UCI", "Triaje crítico inmediato"],
};

export default function Services() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<"scrolly" | "grid">("scrolly");

  useEffect(() => {
    if (viewMode !== "scrolly") return;

    const onScroll = () => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = Math.max(el.offsetHeight - window.innerHeight, 1);
      const raw = -rect.top / scrollable;
      targetProgressRef.current = Math.max(0, Math.min(1, raw));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    let rafId = 0;
    let lastSync = 0;

    const loop = (ts: number) => {
      const diff = targetProgressRef.current - smoothProgressRef.current;
      smoothProgressRef.current += diff * 0.12;

      if (ts - lastSync > 24) {
        setProgress(smoothProgressRef.current);
        lastSync = ts;
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [viewMode]);

  const activeFrameIndex = Math.min(
    servicios.length - 1,
    Math.max(0, Math.round(progress * (servicios.length - 1)))
  );

  const jumpToServiceFrame = (idx: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const scrollable = Math.max(el.offsetHeight - window.innerHeight, 1);
    const ratio = idx / Math.max(1, servicios.length - 1);
    window.scrollTo({
      top: top + scrollable * ratio,
      behavior: "smooth",
    });
  };

  if (viewMode === "grid") {
    return (
      <section
        id="servicios"
        className="w-full bg-slate-50 py-24 dark:bg-slate-950"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                <Sparkles className="h-4 w-4" />
                Servicios Clínicos
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-5xl dark:text-white">
                Todo lo que tu mascota necesita, en un solo lugar
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
                Desde chequeos de rutina hasta procedimientos especializados, con
                equipos modernos y un trato cercano.
              </p>
            </div>

            {/* Segmented Mode Switcher */}
            <div className="inline-flex items-center self-start rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setViewMode("scrolly")}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                <Film className="h-3.5 w-3.5" />
                Modo Scrollytelling
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Vista Cuadrícula
              </button>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicios.map((servicio) => (
              <article
                key={servicio.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-400/60 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={servicio.imagenUrl}
                    alt={servicio.titulo}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-teal-700 backdrop-blur dark:bg-slate-900/90 dark:text-teal-300">
                    {servicio.categoria}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                      <DynamicIcon name={servicio.iconName} size={20} />
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {servicio.titulo}
                    </h3>
                  </div>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {servicio.descripcion}
                  </p>

                  <a
                    href="https://wa.me/51123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
                  >
                    <FaWhatsapp className="h-4 w-4" />
                    Me interesa
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="servicios"
      ref={scrollContainerRef}
      className="relative h-[350vh] w-full bg-slate-100 dark:bg-[#050b18]"
    >
      {/* Sticky Horizontal Cinema-Frame Scrollytelling Stage */}
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden py-20">
        {/* Background Ambient Glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60 transition-all duration-500"
          style={{
            background: `radial-gradient(650px circle at ${25 + progress * 55}% 50%, rgba(20, 184, 166, 0.16), transparent 70%)`,
          }}
        />

        {/* Header Row */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-between gap-4 px-4 sm:px-6 md:flex-row md:items-end lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
              <Film className="h-3.5 w-3.5" />
              Servicios · Galería de Frames en Movimiento
            </div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Todo lo que tu mascota necesita,{" "}
              <span className="text-teal-600 dark:text-teal-400">
                frame a frame
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="hidden rounded-full border border-slate-300/80 bg-white/80 px-3.5 py-1.5 font-mono text-xs font-bold text-slate-700 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:text-teal-300 sm:inline-block">
              SERVICIO {String(activeFrameIndex + 1).padStart(2, "0")} /{" "}
              {String(servicios.length).padStart(2, "0")}
            </span>

            {/* Mode Switcher */}
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 p-1 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
              <button
                type="button"
                onClick={() => setViewMode("scrolly")}
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm"
              >
                <Film className="h-3.5 w-3.5" />
                Frames 3D
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Ver Cuadrícula
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Moving Cinema Frames Track */}
        <div className="perspective-stage relative z-10 flex flex-1 items-center overflow-visible">
          <div
            style={{
              transform: `translate3d(calc(8vw - ${progress * 68}%), 0, 0)`,
            }}
            className="flex items-center gap-6 px-4 transition-none sm:gap-9 sm:px-8"
          >
            {servicios.map((servicio, idx) => {
              const itemRatio = idx / Math.max(1, servicios.length - 1);
              const delta = itemRatio - progress; // -1 to +1 relative to current scroll focus
              const absDelta = Math.abs(delta);
              const isFocused = idx === activeFrameIndex;

              // 3D Coverflow / Apple Spatial Frame Physics
              const rotateY = Math.max(-18, Math.min(18, delta * -22));
              const scale = Math.max(0.88, 1.03 - absDelta * 0.22);
              const translateY = absDelta * 18;
              const imgParallaxX = delta * 45;
              const specs = PROTOCOL_SPECS[servicio.id] ?? [
                "Atención personalizada",
                "Equipos modernos",
                "Seguimiento post-consulta",
              ];

              return (
                <article
                  key={servicio.id}
                  style={{
                    transform: `translate3d(0, ${translateY}px, 0) rotateY(${rotateY}deg) scale(${scale})`,
                  }}
                  className={`group relative flex w-[84vw] max-w-[440px] shrink-0 flex-col overflow-hidden rounded-[2rem] border transition-shadow duration-300 sm:w-[420px] ${
                    isFocused
                      ? "border-teal-400/70 bg-white shadow-[0_25px_70px_-15px_rgba(20,184,166,0.3)] dark:border-teal-400/60 dark:bg-slate-900"
                      : "border-slate-200/80 bg-white/85 opacity-85 shadow-lg dark:border-slate-800 dark:bg-slate-900/80"
                  }`}
                >
                  {/* Cinema Frame Header */}
                  <div className="relative h-52 overflow-hidden sm:h-56">
                    <img
                      src={servicio.imagenUrl}
                      alt={servicio.titulo}
                      style={{
                        transform: `scale(1.18) translate3d(${imgParallaxX}px, 0, 0)`,
                      }}
                      className="h-full w-full object-cover transition-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1 text-xs font-bold text-teal-700 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-teal-300">
                      {servicio.categoria}
                    </span>

                    <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-slate-950/65 px-2.5 py-1 font-mono text-[11px] font-bold text-white backdrop-blur-md">
                      FRM 0{idx + 1} / 0{servicios.length}
                    </span>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-500 text-slate-950 shadow-lg">
                        <DynamicIcon name={servicio.iconName} size={22} />
                      </span>
                      <h3 className="text-xl font-extrabold text-white drop-shadow-sm">
                        {servicio.titulo}
                      </h3>
                    </div>
                  </div>

                  {/* Frame Content Body */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {servicio.descripcion}
                      </p>

                      {/* Clinical Protocol Checklist */}
                      <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3.5 dark:border-slate-800">
                        {specs.map((spec) => (
                          <li
                            key={spec}
                            className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-500" />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href="https://wa.me/51123456789"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-teal-600/20 transition hover:scale-[1.02] hover:shadow-lg"
                    >
                      <FaWhatsapp className="h-4 w-4" />
                      Me interesa
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom Interactive Frame Dots + Progress Track */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            {servicios.map((s, idx) => {
              const active = idx === activeFrameIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => jumpToServiceFrame(idx)}
                  aria-label={`Ir a ${s.titulo}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    active
                      ? "w-10 bg-teal-600 dark:bg-teal-400"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700"
                  }`}
                />
              );
            })}
          </div>

          <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
            Sigue bajando para deslizar los frames de servicios →
          </p>
        </div>
      </div>
    </section>
  );
}
