import veterinarios from "@/data/vetEquipo.json";

export default function Team() {
  return (
    <section id="equipo" className="w-full bg-white py-20 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Nuestro equipo
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            Profesionales que aman lo que hacen
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Un grupo de veterinarios y técnicos comprometidos con la salud y el
            bienestar de cada paciente.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {veterinarios.map((veterinario) => (
            <article
              key={veterinario.id}
              className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800"
            >
              <div className="h-28 w-28 overflow-hidden rounded-full ring-4 ring-teal-100 dark:ring-teal-900/50">
                <img
                  src={veterinario.imagenUrl}
                  alt={`${veterinario.nombre} ${veterinario.apellido}`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <h3 className="mt-4 text-base font-bold leading-tight text-slate-900 dark:text-white">
                {veterinario.nombre} {veterinario.apellido}
              </h3>
              <span className="mt-1 text-sm font-semibold text-teal-600 dark:text-teal-400">
                {veterinario.rol}
              </span>
              <span className="mt-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {veterinario.area}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
