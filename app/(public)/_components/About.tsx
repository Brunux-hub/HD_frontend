import Image from "next/image";
import { Target, Eye } from "lucide-react";

export default function About() {
  return (
    <section id="nosotros" className="w-full bg-white dark:bg-black">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Historia */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Nuestra historia
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            Un lugar donde tu mascota está en buenas manos
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              Healthy Pets nació en 2010 de un grupo de veterinarios que soñaban
              con una clínica distinta: cercana, honesta y con la tecnología
              necesaria para cuidar de verdad a los animales.
            </p>
            <p>
              Hoy acompañamos a miles de familias en cada etapa de la vida de sus
              compañeros: desde la primera vacuna hasta los cuidados de la vejez,
              siempre con el mismo trato humano con el que empezamos.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-teal-100 bg-teal-50/60 p-4 dark:border-teal-900/40 dark:bg-teal-950/30">
            <Image
              className="rounded-full ring-2 ring-teal-200 dark:ring-teal-800"
              src="/logovet2.jpg"
              alt="Healthy Pets"
              width={56}
              height={56}
            />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">
                Equipo colegiado
              </span>{" "}
              y en formación continua para darte lo mejor.
            </p>
          </div>
        </div>

        {/* Misión / Visión */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                <Target className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Misión
              </h3>
            </div>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Brindar atención veterinaria integral, preventiva y especializada,
              promoviendo la salud y el bienestar de las mascotas con un servicio
              profesional, ético y humano.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                <Eye className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Visión
              </h3>
            </div>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Ser la veterinaria referente de la ciudad, reconocida por la calidad
              de su atención, la innovación médica y el compromiso con el cuidado
              responsable de los animales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
