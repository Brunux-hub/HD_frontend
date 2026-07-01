import Image from "next/image";
import Link from "next/link";
import { CalendarHeart, PhoneCall } from "lucide-react";

import heroImg from "@/assets/hero_img.jpg";

const stats = [
  { value: "+2 000", label: "mascotas atendidas" },
  { value: "15 años", label: "de experiencia" },
  { value: "24 / 7", label: "urgencias" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Fondo */}
      <Image
        src={heroImg}
        alt="Veterinaria Healthy Pets"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-950/90 via-teal-900/70 to-slate-950/85" />

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8 lg:py-40">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-400/10 px-4 py-1.5 text-sm font-medium text-teal-100 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-teal-300" />
            Clínica veterinaria en Lima
          </span>

          <h1 className="mt-6 font-hero-title text-4xl leading-[1.05] text-white sm:text-6xl">
            El mejor cuidado para{" "}
            <span className="text-teal-300">quien más quieres</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-teal-50/85">
            En Healthy Pets tratamos a cada mascota como parte de la familia.
            Medicina preventiva, cirugía y urgencias con un equipo que de verdad
            se preocupa.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-6 py-3 font-semibold text-teal-950 shadow-lg shadow-teal-900/30 transition hover:bg-teal-300"
            >
              <CalendarHeart className="h-5 w-5" />
              Agenda una cita
            </Link>
            <Link
              href="#servicios"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Ver servicios
            </Link>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-8">
            {stats.map((item) => (
              <div key={item.label}>
                <dt className="font-hero-title text-2xl text-white sm:text-3xl">
                  {item.value}
                </dt>
                <dd className="mt-1 text-sm text-teal-50/70">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Franja de contacto rápido */}
      <div className="border-t border-white/10 bg-teal-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-teal-50/80">
            ¿Tu mascota necesita atención hoy? Estamos para ayudarte.
          </p>
          <a
            href="tel:+51123456789"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-200 transition hover:text-white"
          >
            <PhoneCall className="h-4 w-4" />
            +51 123 456 789
          </a>
        </div>
      </div>
    </section>
  );
}
