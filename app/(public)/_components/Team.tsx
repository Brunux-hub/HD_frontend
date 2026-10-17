"use client";

import React, { useEffect, useRef, useState } from "react";
import { Award, CheckCircle2, Stethoscope } from "lucide-react";

import veterinarios from "@/data/vetEquipo.json";

function TeamMemberCard({
  veterinario,
  index,
  scrollWave,
}: {
  veterinario: (typeof veterinarios)[number];
  index: number;
  scrollWave: number;
}) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 16,
      ry: (px - 0.5) * 16,
      gx: px * 100,
      gy: py * 100,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  };

  // Wave offset as user scrolls through section
  const waveOffset = Math.sin(scrollWave * Math.PI + index * 0.65) * 14 * (1 - scrollWave);

  return (
    <article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(0, ${waveOffset}px, 0) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.active ? 1.03 : 1})`,
      }}
      className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:border-teal-400/70 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/90"
    >
      {/* Holographic Specular Glare on Hover */}
      <div
        style={{
          opacity: tilt.active ? 1 : 0,
          background: `radial-gradient(240px circle at ${tilt.gx}% ${tilt.gy}%, rgba(45, 212, 191, 0.18), transparent 70%)`,
        }}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
      />

      {/* Top Frame Tag */}
      <div className="mb-4 flex w-full items-center justify-between font-mono text-[10px] text-slate-400">
        <span>STAFF·0{veterinario.id}</span>
        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Activo
        </span>
      </div>

      {/* Avatar Frame with Animated Ring */}
      <div className="relative">
        <div className="h-28 w-28 overflow-hidden rounded-full ring-4 ring-teal-500/25 transition-all duration-500 group-hover:ring-teal-400 dark:ring-teal-400/20">
          <img
            src={veterinario.imagenUrl}
            alt={`${veterinario.nombre} ${veterinario.apellido}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        </div>
        <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white shadow-md ring-2 ring-white dark:bg-teal-400 dark:text-slate-950 dark:ring-slate-900">
          <CheckCircle2 className="h-4 w-4" />
        </span>
      </div>

      <h3 className="mt-5 text-base font-extrabold leading-tight text-slate-900 dark:text-white">
        {veterinario.nombre} {veterinario.apellido}
      </h3>
      <span className="mt-1 text-xs font-bold text-teal-600 dark:text-teal-400">
        {veterinario.rol}
      </span>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Stethoscope className="h-3 w-3 text-teal-500" />
          {veterinario.area}
        </span>
      </div>
    </article>
  );
}

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollWave, setScrollWave] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height))
      );
      setScrollWave(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="equipo"
      ref={sectionRef}
      className="perspective-stage relative w-full overflow-hidden bg-white py-28 dark:bg-black"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
            <Award className="h-3.5 w-3.5" />
            Nuestro Equipo · Especialistas
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Profesionales que aman lo que hacen
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Un grupo de veterinarios y técnicos comprometidos con la salud, la
            ciencia diagnóstica y el bienestar de cada paciente.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {veterinarios.map((veterinario, index) => (
            <TeamMemberCard
              key={veterinario.id}
              veterinario={veterinario}
              index={index}
              scrollWave={scrollWave}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
