"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowDown,
  CalendarHeart,
  CheckCircle2,
  HeartPulse,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import heroImg from "@/assets/hero_img.jpg";

const stats = [
  { value: "+2 000", label: "mascotas atendidas", detail: "Historial clínico 100% digital" },
  { value: "15 años", label: "de experiencia", detail: "Especialistas colegiados" },
  { value: "24 / 7", label: "urgencias activas", detail: "Atención crítica inmediata" },
];

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      setScrollY(Math.min(window.scrollY, 900));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x: nx, y: ny });
  };

  // Scroll-driven Apple parallax values
  const bgScale = 1 + scrollY * 0.00028;
  const heroOpacity = Math.max(0.15, 1 - scrollY / 780);
  const textTranslateY = scrollY * -0.22;

  return (
    <section
      id="inicio"
      onMouseMove={handleMouseMove}
      className="perspective-stage relative isolate min-h-screen overflow-hidden bg-slate-950 pt-20"
    >
      {/* Fondo con Parallax de Escala al bajar */}
      <div
        style={{
          transform: `scale(${bgScale}) translate3d(0, ${scrollY * 0.18}px, 0)`,
        }}
        className="pointer-events-none absolute inset-0 -z-20 transition-transform duration-75"
      >
        <Image
          src={heroImg}
          alt="Veterinaria Healthy Pets"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Capas de Iluminación Cinemática Tipo Apple */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/95 via-teal-950/80 to-slate-950/90" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-75 transition-all duration-300"
        style={{
          background: `radial-gradient(750px circle at ${50 + mouse.x * 20}% ${45 + mouse.y * 20}%, rgba(45, 212, 191, 0.22), transparent 70%)`,
        }}
      />
      <div className="grid-cyber-bg pointer-events-none absolute inset-0 -z-10 opacity-40" />

      <div
        style={{
          transform: `translate3d(0, ${textTranslateY}px, 0)`,
          opacity: heroOpacity,
        }}
        className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-12 lg:px-8 lg:py-28"
      >
        {/* Columna Izquierda: Tipografía Monumental & CTAs */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-teal-300/30 bg-teal-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal-100 shadow-inner backdrop-blur-xl sm:text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-300" />
            </span>
            Clínica veterinaria en Lima · Medicina de Alta Precisión
          </div>

          <h1 className="mt-6 font-hero-title text-4xl leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-[4.15rem]">
            El mejor cuidado para{" "}
            <span className="text-apple-gradient block sm:inline">
              quien más quieres
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-teal-50/85 sm:text-lg">
            En <strong className="font-semibold text-white">Healthy Pets</strong>{" "}
            fusionamos tecnología diagnóstica de última generación, cirugía
            segura y un trato profundamente humano. Desliza hacia abajo y vive
            cómo cuidamos cada latido frame a frame.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="#contacto"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-[0_15px_35px_-10px_rgba(45,212,191,0.65)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_45px_-10px_rgba(45,212,191,0.85)]"
            >
              <CalendarHeart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Agenda una cita
            </Link>
            <Link
              href="#bioscan"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-teal-300/50 hover:bg-white/15"
            >
              <Sparkles className="h-4 w-4 text-teal-300" />
              Explorar BioScan 3D
            </Link>
            <Link
              href="#servicios"
              className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-teal-200 transition hover:text-white"
            >
              Ver servicios →
            </Link>
          </div>

          {/* Estadísticas con micro-tarjetas cristalinas */}
          <dl className="mt-12 grid max-w-xl grid-cols-1 gap-4 border-t border-white/15 pt-8 sm:grid-cols-3">
            {stats.map((item, idx) => (
              <div
                key={item.label}
                style={{
                  transform: `translate3d(0, ${scrollY * (-0.04 * (idx + 1))}px, 0)`,
                }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:border-teal-400/40 hover:bg-white/10"
              >
                <dt className="font-hero-title text-2xl text-white sm:text-3xl">
                  {item.value}
                </dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-wider text-teal-300">
                  {item.label}
                </dd>
                <p className="mt-1 text-[11px] text-teal-50/65">{item.detail}</p>
              </div>
            ))}
          </dl>
        </div>

        {/* Columna Derecha: Escenario 3D de Frames Flotantes tipo Apple Vision */}
        <div className="relative hidden lg:col-span-5 lg:flex lg:h-[520px] lg:items-center lg:justify-center">
          <div
            style={{
              transform: `rotateY(${mouse.x * 10}deg) rotateX(${-mouse.y * 10}deg) translate3d(0, ${scrollY * -0.12}px, 0)`,
            }}
            className="relative h-full w-full transition-transform duration-150 ease-out"
          >
            {/* Frame Central Principal: Monitor Biométrico en Vivo */}
            <div className="apple-hud-frame absolute inset-x-4 top-10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-400/20 text-teal-300">
                    <HeartPulse className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-teal-300">
                      TELEMETRÍA EN TIEMPO REAL
                    </p>
                    <h3 className="text-base font-bold text-white">
                      Monitoreo Clínico HealthyPets™
                    </h3>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 font-mono text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-400/40">
                  ● ONLINE
                </span>
              </div>

              {/* Onda ECG Animada SVG */}
              <div className="relative my-5 overflow-hidden rounded-2xl border border-teal-500/20 bg-slate-950/80 p-4">
                <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-slate-400">
                  <span>ECG · DERIVACIÓN II</span>
                  <span className="font-bold text-teal-300">88 BPM · NORMAL</span>
                </div>
                <svg viewBox="0 0 320 64" className="h-16 w-full">
                  <path
                    d="M 0 32 L 45 32 L 55 20 L 65 44 L 78 6 L 90 56 L 102 25 L 115 32 L 175 32 L 185 20 L 195 44 L 208 6 L 220 56 L 232 25 L 245 32 L 320 32"
                    fill="none"
                    stroke="#2dd4bf"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-ecg"
                  />
                </svg>
              </div>

              {/* Mini-Indicadores Clínicos */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-[10px] text-slate-400">SpO2</p>
                  <p className="mt-0.5 font-mono text-base font-bold text-white">
                    99.4%
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-[10px] text-slate-400">Temp.</p>
                  <p className="mt-0.5 font-mono text-base font-bold text-teal-300">
                    38.3°C
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-[10px] text-slate-400">Triaje</p>
                  <p className="mt-0.5 font-mono text-base font-bold text-emerald-300">
                    Óptimo
                  </p>
                </div>
              </div>
            </div>

            {/* Frame Flotante 2 (Arriba Derecha): Especialistas Colegiados */}
            <div
              style={{
                transform: `translate3d(${mouse.x * -16}px, ${scrollY * -0.18 + mouse.y * -12}px, 40px)`,
              }}
              className="animate-float-slow absolute -right-4 -top-2 z-20 flex items-center gap-3 rounded-2xl border border-white/20 bg-slate-900/85 px-4 py-3 shadow-2xl backdrop-blur-xl"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-white">Staff Colegiado CMVP</p>
                <p className="text-[11px] text-slate-300">Cirugía & Diagnóstico 4K</p>
              </div>
            </div>

            {/* Frame Flotante 3 (Abajo Izquierda): Carnet & Vacunación */}
            <div
              style={{
                transform: `translate3d(${mouse.x * 18}px, ${scrollY * -0.25 + mouse.y * 14}px, 60px)`,
              }}
              className=" absolute -bottom-2 -left-4 z-20 flex items-center gap-3.5 rounded-2xl border border-teal-400/30 bg-slate-900/90 px-4 py-3.5 shadow-2xl backdrop-blur-xl"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/20 text-teal-300">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-white">
                    Protocolo Preventivo 360°
                  </p>
                  <span className="rounded bg-teal-500/20 px-1.5 py-0.5 font-mono text-[9px] text-teal-300">
                    ACTIVO
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Laboratorio propio · Resultados en 15 min
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de Scrollytelling + Franja de Urgencias */}
      <div className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-teal-50/80">
            ¿Tu mascota necesita atención hoy? Estamos listos para ayudarte las
            24 horas.
          </p>

          <a
            href="#bioscan"
            className="group inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs font-semibold text-teal-200 transition hover:bg-teal-400/20"
          >
            <Activity className="h-3.5 w-3.5 text-teal-300" />
            Baja para mover los 120 frames interactivos
            <ArrowDown className="h-3.5 w-3.5 animate-bounce text-teal-300" />
          </a>

          <a
            href="tel:+51123456789"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-300 transition hover:text-white"
          >
            <PhoneCall className="h-4 w-4" />
            +51 123 456 789
          </a>
        </div>
      </div>
    </section>
  );
}
