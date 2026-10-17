"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  HeartPulse,
  Layers,
  Pause,
  Play,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Syringe,
} from "lucide-react";

import cuteDog from "@/assets/cute-dog.png";

const TOTAL_FRAMES = 120;

interface Chapter {
  id: string;
  number: string;
  frameRange: [number, number];
  badge: string;
  title: string;
  highlight: string;
  description: string;
  metrics: { label: string; value: string; status: string }[];
  accentColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CHAPTERS: Chapter[] = [
  {
    id: "triaje",
    number: "01",
    frameRange: [1, 30],
    badge: "FRAMES 001 – 030 · TRIAJE BIOMÉTRICO",
    title: "Evaluación clínica",
    highlight: "al primer latido.",
    description:
      "Desde el instante en que tu mascota cruza nuestra puerta, registramos signos vitales basales sin estrés. Sensores no invasivos y protocolos Fear-Free™ calibran su estado fisiológico en segundos.",
    metrics: [
      { label: "Frecuencia Cardíaca", value: "86 BPM", status: "Ritmo Sinusal" },
      { label: "Temperatura Corporal", value: "38.3 °C", status: "Rango Óptimo" },
      { label: "Índice de Estrés", value: "Mínimo", status: "Protocolo Fear-Free" },
    ],
    accentColor: "#2dd4bf",
    icon: HeartPulse,
  },
  {
    id: "escaner",
    number: "02",
    frameRange: [31, 60],
    badge: "FRAMES 031 – 060 · DIAGNÓSTICO POR IMAGEN HD",
    title: "Visión profunda.",
    highlight: "Precisión milimétrica.",
    description:
      "Nuestro laboratorio clínico e imagenología Doppler procesan muestras de sangre, perfiles bioquímicos y ecografías de alta definición en menos de 15 minutos para decisiones médicas exactas.",
    metrics: [
      { label: "Panel Hematológico", value: "24 Parámetros", status: "12 min" },
      { label: "Ultrasonido Doppler", value: "Resolución 4K", status: "Tiempo Real" },
      { label: "Saturación SpO2", value: "99.4 %", status: "Oxigenación Pura" },
    ],
    accentColor: "#38bdf8",
    icon: ScanLine,
  },
  {
    id: "inmunidad",
    number: "03",
    frameRange: [61, 90],
    badge: "FRAMES 061 – 090 · ESCUDO INMUNOLÓGICO 360°",
    title: "Bio-protección",
    highlight: "activa todo el año.",
    description:
      "Diseñamos esquemas vacunales y antiparasitarios a medida según la edad, raza y estilo de vida de tu compañero. Cada dosis queda trazada con lote biológico y alertas automáticas.",
    metrics: [
      { label: "Cobertura Viral", value: "99.8 %", status: "Inmunidad Activa" },
      { label: "Control Antiparasitario", value: "365 Días", status: "Doble Barrera" },
      { label: "Trazabilidad Lote", value: "ISO Cert.", status: "Cadena de Frío" },
    ],
    accentColor: "#34d399",
    icon: Syringe,
  },
  {
    id: "cirugia",
    number: "04",
    frameRange: [91, 120],
    badge: "FRAMES 091 – 120 · QUIRÓFANO & CLOUD 24/7",
    title: "Cirugía avanzada y",
    highlight: "expediente en la nube.",
    description:
      "Monitoreo multiparamétrico continuo, anestesia inhalatoria de última generación y un historial clínico digital conectado 24/7 para urgencias o consultas desde cualquier lugar.",
    metrics: [
      { label: "Anestesia Inhalatoria", value: "Sevoflurano", status: "Monitoreo 6-Ch" },
      { label: "Respuesta Urgencias", value: "24 / 7 / 365", status: "Guardia Activa" },
      { label: "Historial Digital", value: "Cloud Sync", status: "Acceso Instantáneo" },
    ],
    accentColor: "#a78bfa",
    icon: ShieldCheck,
  },
];

interface FloatingMicroFrame {
  id: string;
  code: string;
  label: string;
  value: string;
  sub: string;
  baseX: number; // percentage offset from center (-1 to 1)
  baseY: number; // percentage offset from center (-1 to 1)
  peakProgress: number; // 0 to 1
}

const MICRO_FRAMES: FloatingMicroFrame[] = [
  {
    id: "mf-1",
    code: "FRM·014",
    label: "CARDIOGRAMA",
    value: "86 BPM · Estable",
    sub: "Onda P-QRS-T normal",
    baseX: -0.78,
    baseY: -0.52,
    peakProgress: 0.14,
  },
  {
    id: "mf-2",
    code: "FRM·028",
    label: "TERMOGRAFÍA IR",
    value: "38.3 °C",
    sub: "Homeostasis térmica",
    baseX: 0.78,
    baseY: -0.38,
    peakProgress: 0.25,
  },
  {
    id: "mf-3",
    code: "FRM·046",
    label: "ECO-DOPPLER TORÁCICO",
    value: "Flujo Laminar",
    sub: "Válvula mitral íntegra",
    baseX: -0.82,
    baseY: 0.35,
    peakProgress: 0.42,
  },
  {
    id: "mf-4",
    code: "FRM·068",
    label: "MEMORIA INMUNE",
    value: "IgG / IgM Alto",
    sub: "Séxtuple + Rabia al día",
    baseX: 0.82,
    baseY: 0.42,
    peakProgress: 0.62,
  },
  {
    id: "mf-5",
    code: "FRM·094",
    label: "OXIMETRÍA DE PULSO",
    value: "SpO2 99.4%",
    sub: "Perfusión tisular grado A",
    baseX: -0.75,
    baseY: -0.15,
    peakProgress: 0.82,
  },
  {
    id: "mf-6",
    code: "FRM·115",
    label: "EXPEDIENTE CLOUD",
    value: "ID #HP-2026",
    sub: "Sincronizado en tiempo real",
    baseX: 0.76,
    baseY: -0.12,
    peakProgress: 0.95,
  },
];

// Deterministic 3D particles for the canvas so SSR/hydration is clean
const PARTICLES = Array.from({ length: 75 }, (_, i) => {
  const seed1 = Math.sin(i * 12.9898) * 43758.5453;
  const seed2 = Math.cos(i * 78.233) * 23421.631;
  const seed3 = Math.sin(i * 45.164) * 19283.412;
  const rx = seed1 - Math.floor(seed1);
  const ry = seed2 - Math.floor(seed2);
  const rz = seed3 - Math.floor(seed3);
  return {
    x: (rx - 0.5) * 1600,
    y: (ry - 0.5) * 1000,
    z: rz * 1000 + 80,
    size: (i % 3) + 1.2,
    hue: i % 2 === 0 ? 172 : 195,
  };
});

export default function ScrollytellingFrames() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Smooth interpolated progress (0 -> 1)
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const isAutoPlayingRef = useRef(false);

  const [displayFrame, setDisplayFrame] = useState(1);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Toggle auto-play mode
  const toggleAutoPlay = () => {
    const next = !isAutoPlayingRef.current;
    isAutoPlayingRef.current = next;
    setIsAutoPlaying(next);
  };

  // Jump to a specific chapter by scrolling window smoothly to that position
  const scrollToChapter = (chapterIndex: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const scrollableDistance = container.offsetHeight - window.innerHeight;
    const chapterMidProgress = (chapterIndex + 0.35) / CHAPTERS.length;
    window.scrollTo({
      top: containerTop + scrollableDistance * chapterMidProgress,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isAutoPlayingRef.current) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrollable = Math.max(container.offsetHeight - window.innerHeight, 1);
      const raw = -rect.top / scrollable;
      targetProgressRef.current = Math.max(0, Math.min(1, raw));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    let rafId = 0;
    let lastReactSync = 0;

    const renderLoop = (timestamp: number) => {
      if (isAutoPlayingRef.current) {
        targetProgressRef.current += 0.0018;
        if (targetProgressRef.current >= 1) {
          targetProgressRef.current = 0;
        }
      }

      // Apple-style damped spring interpolation
      const diff = targetProgressRef.current - smoothProgressRef.current;
      smoothProgressRef.current += diff * 0.1;

      const p = smoothProgressRef.current;
      const frameNum = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(1 + p * (TOTAL_FRAMES - 1)))
      );

      // Throttle React state updates slightly (~30fps for DOM HUD, while canvas runs at full 60/120fps)
      if (timestamp - lastReactSync > 28) {
        setDisplayFrame(frameNum);
        setSmoothProgress(p);
        lastReactSync = timestamp;
      }

      // Draw current procedural frame onto high-DPI canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const width = canvas.clientWidth;
          const height = canvas.clientHeight;
          if (
            canvas.width !== Math.floor(width * dpr) ||
            canvas.height !== Math.floor(height * dpr)
          ) {
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
          }

          ctx.save();
          ctx.scale(dpr, dpr);
          drawBioScanFrame(ctx, width, height, p, frameNum, timestamp * 0.001);
          ctx.restore();
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Determine active chapter index (0..3)
  const activeChapterIndex = Math.min(
    CHAPTERS.length - 1,
    Math.floor(smoothProgress * CHAPTERS.length)
  );
  const activeChapter = CHAPTERS[activeChapterIndex];

  // Calculate 3D transformations for the central subject frame
  const petRotateY = Math.sin(smoothProgress * Math.PI * 2) * 11;
  const petRotateX = Math.cos(smoothProgress * Math.PI * 2) * 5;
  const petScale = 0.92 + Math.sin(smoothProgress * Math.PI) * 0.12;
  // Scanner beam position (oscillates smoothly with scroll frames)
  const scannerPercent = ((smoothProgress * 300) % 100);
  const isXrayPhase = smoothProgress >= 0.22 && smoothProgress <= 0.78;

  return (
    <section
      id="bioscan"
      ref={containerRef}
      className="relative h-[460vh] w-full select-none bg-slate-950"
    >
      {/* Sticky Full-Screen Viewport */}
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-[#020617]">
        {/* Ambient Radial Spotlight that shifts color with chapters */}
        <div
          className="pointer-events-none absolute inset-0 transition-colors duration-700"
          style={{
            background: `radial-gradient(circle at ${50 + Math.sin(smoothProgress * 6) * 15}% ${48 + Math.cos(smoothProgress * 4) * 10}%, ${activeChapter.accentColor}22 0%, rgba(15, 23, 42, 0.4) 45%, #020617 85%)`,
          }}
        />

        {/* High-DPI 60FPS Frame-Scrubbing Canvas */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        {/* TOP HUD BAR: Live Frame Telemetry & Chapter Sequence */}
        <div className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-20 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 rounded-full border border-teal-500/30 bg-slate-900/75 px-4 py-1.5 backdrop-blur-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-400" />
            </span>
            <span className="font-mono text-xs font-semibold tracking-wider text-teal-300">
              APPLE-SCROLL ENGINE · BIOSCAN 360°
            </span>
          </div>

          <div className="hidden items-center gap-4 rounded-full border border-white/10 bg-slate-900/75 px-5 py-1.5 font-mono text-xs text-slate-300 backdrop-blur-xl md:flex">
            <span className="flex items-center gap-1.5 text-teal-300">
              <Layers className="h-3.5 w-3.5" />
              FRAME{" "}
              <strong className="text-white">
                {String(displayFrame).padStart(3, "0")}
              </strong>{" "}
              / {TOTAL_FRAMES}
            </span>
            <span className="text-slate-600">|</span>
            <span>
              PROGRESO{" "}
              <strong className="text-white">
                {Math.round(smoothProgress * 100)}%
              </strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400">60 FPS LOCK</span>
          </div>
        </div>

        {/* CENTER 3D STAGE: Moving Story Frames + Central Holographic Pet Frame + Orbiting Micro-Frames */}
        <div className="perspective-stage relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          {/* LEFT COLUMN: 3D Moving Chapter Frames (Chapters stack and fly through Z-space on scroll) */}
          <div className="relative flex h-[320px] items-center lg:col-span-5 lg:h-[430px]">
            {CHAPTERS.map((chapter, idx) => {
              const chapterStart = idx / CHAPTERS.length;
              const chapterEnd = (idx + 1) / CHAPTERS.length;
              const chapterCenter = (chapterStart + chapterEnd) / 2;
              const dist = (smoothProgress - chapterCenter) * CHAPTERS.length; // -1 to +1 around active chapter
              const absDist = Math.abs(dist);
              const isVisible = absDist < 1.15;

              // Apple-style 3D card flight physics
              const translateY = dist * -115;
              const translateZ = -absDist * 180;
              const rotateX = dist * 18;
              const scale = Math.max(0.82, 1 - absDist * 0.15);
              const opacity = Math.max(0, Math.min(1, 1.15 - absDist * 1.35));
              const Icon = chapter.icon;

              if (!isVisible) return null;

              return (
                <div
                  key={chapter.id}
                  style={{
                    transform: `translate3d(0px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`,
                    opacity,
                    zIndex: 20 - Math.round(absDist * 10),
                  }}
                  className="apple-hud-frame absolute inset-x-0 rounded-3xl p-6 transition-shadow duration-300 sm:p-8"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] font-semibold tracking-wider"
                      style={{
                        backgroundColor: `${chapter.accentColor}20`,
                        color: chapter.accentColor,
                        border: `1px solid ${chapter.accentColor}45`,
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {chapter.badge}
                    </span>
                    <span className="font-mono text-2xl font-black text-white/15">
                      {chapter.number}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                    {chapter.title}{" "}
                    <span
                      style={{ color: chapter.accentColor }}
                      className="block sm:inline"
                    >
                      {chapter.highlight}
                    </span>
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                    {chapter.description}
                  </p>

                  {/* Live Scrubbed Telemetry Metrics inside the moving frame */}
                  <div className="mt-5 grid grid-cols-3 gap-2.5 border-t border-white/10 pt-4">
                    {chapter.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-2xl border border-white/10 bg-slate-950/60 p-2.5"
                      >
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                          {m.label}
                        </p>
                        <p
                          className="mt-1 font-mono text-sm font-bold sm:text-base"
                          style={{ color: chapter.accentColor }}
                        >
                          {m.value}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {m.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT/CENTER COLUMN: 3D Holographic Subject Frame + Moving Orbiting Telemetry Frames */}
          <div className="relative flex h-[340px] items-center justify-center lg:col-span-7 lg:h-[520px]">
            {/* Orbiting 3D Micro-Frames that move across the viewport as you scroll */}
            {MICRO_FRAMES.map((mf, i) => {
              const delta = smoothProgress - mf.peakProgress;
              const proximity = Math.max(0, 1 - Math.abs(delta) * 2.8);
              const driftY = delta * -220 + Math.sin(smoothProgress * 10 + i) * 14;
              const driftX = Math.cos(smoothProgress * 6 + i) * 12;
              const scale = 0.78 + proximity * 0.28;
              const opacity = 0.2 + proximity * 0.8;

              return (
                <div
                  key={mf.id}
                  style={{
                    left: `${50 + mf.baseX * 38}%`,
                    top: `${50 + mf.baseY * 36}%`,
                    transform: `translate(-50%, -50%) translate3d(${driftX}px, ${driftY}px, ${proximity * 60}px) scale(${scale})`,
                    opacity,
                    borderColor:
                      proximity > 0.65
                        ? activeChapter.accentColor
                        : "rgba(148, 163, 184, 0.22)",
                  }}
                  className="pointer-events-none absolute z-30 hidden w-48 rounded-2xl border bg-slate-950/80 p-3 backdrop-blur-xl shadow-2xl sm:block"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-teal-400">
                    <span>{mf.code}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                  </div>
                  <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-300">
                    {mf.label}
                  </p>
                  <p className="font-mono text-sm font-bold text-white">
                    {mf.value}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{mf.sub}</p>
                </div>
              );
            })}

            {/* Central 3D Transforming Diagnostic Frame */}
            <div
              style={{
                transform: `rotateY(${petRotateY}deg) rotateX(${petRotateX}deg) scale(${petScale})`,
              }}
              className="relative flex h-72 w-72 items-center justify-center rounded-[2.5rem] border border-teal-400/30 bg-gradient-to-b from-teal-950/40 via-slate-900/60 to-slate-950/90 p-6 shadow-[0_0_90px_-15px_rgba(45,212,191,0.35)] backdrop-blur-md sm:h-96 sm:w-96"
            >
              {/* Corner Apple Vision HUD Target Brackets */}
              <span className="absolute left-4 top-4 h-6 w-6 rounded-tl-xl border-l-2 border-t-2 border-teal-400" />
              <span className="absolute right-4 top-4 h-6 w-6 rounded-tr-xl border-r-2 border-t-2 border-teal-400" />
              <span className="absolute bottom-4 left-4 h-6 w-6 rounded-bl-xl border-b-2 border-l-2 border-teal-400" />
              <span className="absolute bottom-4 right-4 h-6 w-6 rounded-br-xl border-b-2 border-r-2 border-teal-400" />

              {/* Top Frame Metadata */}
              <div className="absolute left-6 right-6 top-5 flex items-center justify-between font-mono text-[10px] text-teal-300/80">
                <span>SUJETO: CANIS LUPUS · MAX</span>
                <span>ZOOM {(petScale * 100).toFixed(0)}%</span>
              </div>

              {/* Base High-Res Cutout Pet Image */}
              <div className="relative h-56 w-56 sm:h-72 sm:w-72">
                <Image
                  src={cuteDog}
                  alt="Escaneo Biométrico Healthy Pets"
                  fill
                  sizes="(max-width: 768px) 240px, 320px"
                  className="object-contain drop-shadow-[0_20px_35px_rgba(20,184,166,0.35)] transition-all duration-300"
                  style={{
                    filter: isXrayPhase
                      ? "contrast(1.12) saturate(1.15) drop-shadow(0 0 18px rgba(56,189,248,0.55))"
                      : "none",
                  }}
                />

                {/* Holographic Biometric X-Ray / Cardiac Overlay synchronized with Scroll */}
                <svg
                  viewBox="0 0 200 200"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  style={{
                    opacity: 0.35 + Math.sin(smoothProgress * Math.PI) * 0.55,
                  }}
                >
                  {/* Target Reticle on Chest (Heart) */}
                  <g transform="translate(102, 118)">
                    <circle
                      r="22"
                      fill="none"
                      stroke={activeChapter.accentColor}
                      strokeWidth="1"
                      strokeDasharray="4 3"
                    />
                    <circle
                      r={10 + Math.sin(displayFrame * 0.45) * 4}
                      fill={`${activeChapter.accentColor}33`}
                      stroke={activeChapter.accentColor}
                      strokeWidth="1.5"
                    />
                    {/* Live ECG Heartbeat Line inside chest reticle */}
                    <path
                      d="M -18 0 L -8 0 L -5 -6 L -1 9 L 3 -12 L 7 7 L 10 -2 L 18 0"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>

                  {/* Cranial / Neural Sensor Node */}
                  <g transform="translate(98, 52)">
                    <circle
                      r="12"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle r="3" fill="#38bdf8" />
                  </g>

                  {/* Biometric Spine / Vector Axis */}
                  <line
                    x1="98"
                    y1="64"
                    x2="102"
                    y2="148"
                    stroke={activeChapter.accentColor}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                </svg>
              </div>

              {/* Moving Laser Scan Line inside the Frame */}
              <div
                style={{
                  top: `${12 + scannerPercent * 0.76}%`,
                  background: `linear-gradient(90deg, transparent 0%, ${activeChapter.accentColor} 50%, transparent 100%)`,
                  boxShadow: `0 0 20px 2px ${activeChapter.accentColor}`,
                }}
                className="pointer-events-none absolute inset-x-4 h-0.5 transition-none"
              />

              {/* Bottom Live ECG Strip inside the Central Frame */}
              <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-teal-400" />
                  <span className="font-mono text-[11px] font-semibold text-white">
                    TELEMETRÍA EN VIVO
                  </span>
                </div>
                <span className="font-mono text-[11px] text-teal-300">
                  FRM #{String(displayFrame).padStart(3, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM APPLE DYNAMIC CONTROLLER DOCK */}
        <div className="relative z-20 mx-auto mb-6 flex w-full max-w-4xl flex-col items-center gap-3 px-4">
          <div className="flex w-full flex-wrap items-center justify-between gap-2 rounded-full border border-white/15 bg-slate-900/85 p-2 shadow-2xl backdrop-blur-2xl">
            {/* Auto-Scrub Play/Pause Button */}
            <button
              type="button"
              onClick={toggleAutoPlay}
              className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-teal-400"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  Pausar Frames
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Auto-Reproducir
                </>
              )}
            </button>

            {/* Chapter Selector Pills */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              {CHAPTERS.map((ch, idx) => {
                const isActive = idx === activeChapterIndex;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => scrollToChapter(idx)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      isActive
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="mr-1 font-mono text-[10px] opacity-60">
                      {ch.number}
                    </span>
                    {ch.id === "triaje"
                      ? "Triaje"
                      : ch.id === "escaner"
                        ? "Imagen HD"
                        : ch.id === "inmunidad"
                          ? "Inmunidad"
                          : "Quirófano"}
                  </button>
                );
              })}
            </div>

            {/* Quick CTA */}
            <Link
              href="#contacto"
              className="hidden items-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-400/10 px-4 py-2 text-xs font-semibold text-teal-300 transition hover:bg-teal-400/20 sm:inline-flex"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Agendar chequeo
            </Link>
          </div>

          {/* 120-Frame Scrubber Timeline Bar */}
          <div className="relative h-1.5 w-full max-w-md overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 transition-none"
              style={{ width: `${smoothProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Renders a single procedural 3D frame on the HTML5 Canvas,
 * synchronized to the user's scroll position (progress: 0..1, frameNum: 1..120).
 */
function drawBioScanFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  frameNum: number,
  timeSec: number
) {
  ctx.clearRect(0, 0, width, height);

  const cx = width >= 1024 ? width * 0.68 : width * 0.5;
  const cy = height * 0.5;

  // 1. Perspective 3D Cyber Grid Floor
  const horizonY = height * (0.68 - progress * 0.12);
  ctx.save();
  ctx.strokeStyle = "rgba(45, 212, 191, 0.09)";
  ctx.lineWidth = 1;

  const numRadialLines = 18;
  for (let i = -numRadialLines; i <= numRadialLines; i++) {
    const xBottom = cx + i * 110 + ((progress * 600) % 110);
    ctx.beginPath();
    ctx.moveTo(cx + i * 18, horizonY);
    ctx.lineTo(xBottom, height);
    ctx.stroke();
  }

  // Horizontal perspective depth lines moving toward viewer as frames advance
  const gridOffset = (progress * 18) % 1;
  for (let row = 0; row < 10; row++) {
    const t = (row + gridOffset) / 10;
    const y = horizonY + Math.pow(t, 1.8) * (height - horizonY);
    ctx.strokeStyle = `rgba(45, 212, 191, ${t * 0.14})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // 2. 3D-Projected Bio-Particles flying through Z-space with scroll
  ctx.save();
  const fov = 380;
  for (let i = 0; i < PARTICLES.length; i++) {
    const pt = PARTICLES[i];
    // Move Z toward camera as user scrolls down
    let z = (pt.z - progress * 950) % 1000;
    if (z <= 10) z += 1000;

    const scale = fov / (fov + z);
    const px = cx + pt.x * scale;
    const py = cy + pt.y * scale;
    const alpha = Math.min(0.75, (1 - z / 1000) * 0.85);

    if (px >= 0 && px <= width && py >= 0 && py <= height) {
      ctx.fillStyle = `hsla(${pt.hue}, 85%, 65%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, pt.size * scale * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 3. 120-Tick Apple Watch Ultra / Vision Pro Frame Bezel around Subject
  const bezelRadius = Math.min(width, height) * 0.34;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(progress * Math.PI * 0.5);

  for (let tick = 1; tick <= TOTAL_FRAMES; tick++) {
    const angle = (tick / TOTAL_FRAMES) * Math.PI * 2 - Math.PI / 2;
    const isReached = tick <= frameNum;
    const isMajor = tick % 10 === 0;
    const innerR = bezelRadius - (isMajor ? 12 : 6);
    const outerR = bezelRadius;

    ctx.strokeStyle = isReached
      ? isMajor
        ? "rgba(45, 212, 191, 0.9)"
        : "rgba(56, 189, 248, 0.55)"
      : "rgba(148, 163, 184, 0.14)";
    ctx.lineWidth = isMajor ? 2 : 1;

    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
    ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Concentric 3D Orbital Telemetry Rings that tilt with scroll progress
  ctx.save();
  ctx.translate(cx, cy);
  for (let rIdx = 0; rIdx < 3; rIdx++) {
    ctx.save();
    const ringAngle =
      progress * Math.PI * (1.8 + rIdx * 0.7) + timeSec * (0.25 + rIdx * 0.1);
    ctx.rotate(ringAngle);
    const rx = bezelRadius * (0.78 + rIdx * 0.18);
    const ry = rx * (0.38 + 0.18 * Math.sin(progress * Math.PI + rIdx));

    ctx.strokeStyle =
      rIdx === 0
        ? "rgba(45, 212, 191, 0.28)"
        : rIdx === 1
          ? "rgba(56, 189, 248, 0.22)"
          : "rgba(167, 139, 250, 0.2)";
    ctx.lineWidth = 1.25;
    ctx.setLineDash(rIdx === 1 ? [8, 6] : []);

    ctx.beginPath();
    ctx.ellipse(0, 0, rx, Math.max(24, ry), 0, 0, Math.PI * 2);
    ctx.stroke();

    // Glowing node orbiting along the ellipse
    const nodeAngle = progress * Math.PI * 4 + rIdx * 2;
    const nx = Math.cos(nodeAngle) * rx;
    const ny = Math.sin(nodeAngle) * Math.max(24, ry);
    ctx.fillStyle = "#5eead4";
    ctx.beginPath();
    ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();
}
