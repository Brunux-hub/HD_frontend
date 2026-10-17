"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogIn, Sparkles } from "lucide-react";
import { MdSunny } from "react-icons/md";
import { RiMoonClearFill } from "react-icons/ri";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

const links = [
  { href: "#inicio", label: "Inicio", id: "inicio" },
  { href: "#bioscan", label: "BioScan 3D", id: "bioscan", isNew: true },
  { href: "#nosotros", label: "Nosotros", id: "nosotros" },
  { href: "#servicios", label: "Servicios", id: "servicios" },
  { href: "#equipo", label: "Equipo", id: "equipo" },
  { href: "#contacto", label: "Contacto", id: "contacto" },
];

const Navbar = () => {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSection, setActiveSection] = useState("inicio");

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = mounted && resolvedTheme === "dark";
  const handleThemeToggle = () => setTheme(isDark ? "light" : "dark");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 28);

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercent(docHeight > 0 ? Math.min(100, (y / docHeight) * 100) : 0);

      // Detect active section
      const sectionIds = ["contacto", "equipo", "servicios", "nosotros", "bioscan", "inicio"];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center px-3 pt-2 sm:px-6 sm:pt-3">
      <nav
        className={`pointer-events-auto relative w-full transition-all duration-500 ease-out ${
          scrolled
            ? "max-w-5xl rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.22)] backdrop-blur-2xl dark:border-teal-500/25 dark:bg-slate-950/80 dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.75)]"
            : "max-w-7xl rounded-2xl border border-transparent bg-white/70 px-4 py-3 backdrop-blur-xl dark:bg-slate-950/65"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Marca */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <Image
                className="rounded-full ring-2 ring-teal-400/60 transition-transform duration-300 group-hover:scale-105"
                src="/logovet2.jpg"
                alt="Healthy Pets"
                width={38}
                height={38}
                priority
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                Healthy
                <span className="text-teal-600 dark:text-teal-400">Pets</span>
              </span>
              <span className="hidden text-[10px] font-medium tracking-wider text-slate-400 sm:block">
                VETERINARY STUDIO
              </span>
            </div>
          </Link>

          {/* Links desktop (Dynamic Island Pill Track) */}
          <div className="hidden items-center gap-1 rounded-full bg-slate-100/80 p-1 md:flex dark:bg-slate-900/80">
            {links.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-white text-teal-700 shadow-sm dark:bg-teal-500 dark:text-slate-950"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  {link.isNew && (
                    <Sparkles
                      className={`h-3 w-3 ${
                        isActive ? "text-teal-600 dark:text-slate-950" : "text-teal-400"
                      }`}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Acciones derecha */}
          <div className="hidden items-center gap-2.5 md:flex">
            <button
              type="button"
              aria-label={isDark ? "Modo claro" : "Modo oscuro"}
              onClick={handleThemeToggle}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-600 transition hover:scale-105 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              {isDark ? (
                <RiMoonClearFill size={18} className="text-teal-300" />
              ) : (
                <MdSunny size={18} className="text-amber-500" />
              )}
            </button>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-2 text-xs font-bold text-white shadow-md shadow-teal-600/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-teal-500/35"
            >
              <LogIn className="h-3.5 w-3.5" />
              Ingresar
            </Link>
          </div>

          {/* Toggle móvil */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              aria-label={isDark ? "Modo claro" : "Modo oscuro"}
              onClick={handleThemeToggle}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              {isDark ? (
                <RiMoonClearFill size={18} className="text-teal-300" />
              ) : (
                <MdSunny size={18} className="text-amber-500" />
              )}
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              onClick={() => setMobileMenuIsOpen((prev) => !prev)}
              aria-label="Menú"
            >
              {mobileMenuIsOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Barra de progreso de Scrollytelling integrada en el borde inferior */}
        <div className="pointer-events-none absolute inset-x-6 bottom-0 h-[2px] overflow-hidden rounded-full bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 transition-all duration-150"
            style={{ width: `${scrollPercent}%` }}
          />
        </div>

        {/* Menú móvil */}
        {mobileMenuIsOpen && (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-xl md:hidden dark:border-slate-800 dark:bg-slate-950/95">
            <div className="space-y-1">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-700 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-teal-400"
                  onClick={() => setMobileMenuIsOpen(false)}
                >
                  <span>{link.label}</span>
                  {link.isNew && (
                    <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[10px] font-bold text-teal-500">
                      3D SCROLL
                    </span>
                  )}
                </Link>
              ))}
              <Link
                href="/login"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-3 py-2.5 text-sm font-bold text-white"
                onClick={() => setMobileMenuIsOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                Ingresar al Sistema
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
