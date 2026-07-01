"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogIn } from "lucide-react";
import { MdSunny } from "react-icons/md";
import { RiMoonClearFill } from "react-icons/ri";
import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

const links = [
  { href: "/", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#equipo", label: "Equipo" },
  { href: "#contacto", label: "Contacto" },
];

const Navbar = () => {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = mounted && resolvedTheme === "dark";
  const handleThemeToggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <nav className="w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Marca */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              className="rounded-full ring-2 ring-teal-200 dark:ring-teal-800"
              src="/logovet2.jpg"
              alt="Healthy Pets"
              width={44}
              height={44}
              priority
            />
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Healthy<span className="text-teal-600 dark:text-teal-400">Pets</span>
            </span>
          </Link>

          {/* Links desktop */}
          <div className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400"
              >
                {link.label}
              </Link>
            ))}

            <button
              type="button"
              aria-label={isDark ? "Modo claro" : "Modo oscuro"}
              onClick={handleThemeToggle}
              className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {isDark ? (
                <RiMoonClearFill size={22} />
              ) : (
                <MdSunny size={22} className="text-amber-400" />
              )}
            </button>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              <LogIn className="h-4 w-4" />
              Ingresar
            </Link>
          </div>

          {/* Toggle móvil */}
          <button
            className="text-slate-700 md:hidden dark:text-slate-200"
            onClick={() => setMobileMenuIsOpen((prev) => !prev)}
            aria-label="Menú"
          >
            {mobileMenuIsOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuIsOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="space-y-1 px-4 py-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-slate-700 transition hover:bg-teal-50 hover:text-teal-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-400"
                onClick={() => setMobileMenuIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-3 py-2.5 font-semibold text-white"
              onClick={() => setMobileMenuIsOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              Ingresar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
