import Link from "next/link";

export default function Sidebar() {
  return (
    <nav className="flex flex-col gap-3 p-5 border-r border-slate-200 bg-slate-50 min-h-screen w-56 dark:border-slate-800 dark:bg-slate-950">
      <Link
        href="/dashboard/usuarios"
        className="rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        USUARIOS
      </Link>
      <Link
        href="/dashboard/servicios"
        className="rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        SERVICIOS
      </Link>
      <Link
        href="/dashboard/pacientes"
        className="rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        PACIENTES
      </Link>
    </nav>
  );
}
