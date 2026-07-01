import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { FaWhatsapp } from "react-icons/fa6";

import servicios from "@/data/vetServicios.json";

export default function Services() {
  return (
    <section
      id="servicios"
      className="w-full bg-slate-50 py-20 dark:bg-slate-950"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Servicios
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            Todo lo que tu mascota necesita, en un solo lugar
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Desde chequeos de rutina hasta procedimientos especializados, con
            equipos modernos y un trato cercano.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map((servicio) => (
            <article
              key={servicio.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={servicio.imagenUrl}
                  alt={servicio.titulo}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-teal-700 backdrop-blur dark:bg-slate-900/90 dark:text-teal-300">
                  {servicio.categoria}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                    <DynamicIcon name={servicio.iconName} size={20} />
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
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
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
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
