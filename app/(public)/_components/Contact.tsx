import { MapPin, Phone, Mail, Clock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const info = [
  { icon: MapPin, label: "Dirección", value: "Jr. La Esquina 1011, Lima, Perú" },
  { icon: Phone, label: "Teléfono", value: "+51 123 456 789" },
  { icon: Mail, label: "Correo", value: "contacto@healthypets.pe" },
  { icon: Clock, label: "Horario", value: "Lun a Sáb · 8:00 – 20:00 · Urgencias 24/7" },
];

export default function Contact() {
  return (
    <section id="contacto" className="w-full bg-slate-50 py-20 dark:bg-slate-950">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Info */}
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Contacto
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            Hablemos sobre tu mascota
          </h2>
          <p className="mt-4 max-w-md text-base text-slate-600 dark:text-slate-300">
            Déjanos tus datos y te contactamos para coordinar la cita en el
            horario que mejor te acomode.
          </p>

          <ul className="mt-8 space-y-5">
            {info.map((item) => (
              <li key={item.label} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.label}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {item.value}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Formulario */}
        <form className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Solicita tu cita
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Te respondemos en menos de 24 horas.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Nombres y apellidos
              </label>
              <Input id="name" autoComplete="off" placeholder="Ej. María Torres" className="rounded-xl" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Correo
                </label>
                <Input id="email" type="email" autoComplete="off" placeholder="tucorreo@email.com" className="rounded-xl" />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Teléfono
                </label>
                <Input id="phone" autoComplete="off" placeholder="987 654 321" className="rounded-xl" />
              </div>
            </div>

            <div>
              <label htmlFor="serviceDescription" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
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
              className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Enviar solicitud
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
