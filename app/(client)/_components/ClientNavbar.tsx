"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PawPrint, LogOut, Home } from "lucide-react";

import { logout } from "@/services/auth/auth";

const links = [
  { href: "/cliente", label: "Inicio", icon: Home },
  { href: "/cliente/mascotas", label: "Mis Mascotas", icon: PawPrint },
];

const ClientNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/cliente" ? pathname === "/cliente" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-teal-100 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Marca */}
        <Link href="/cliente" className="flex items-center gap-2.5">
          <Image
            src="/logovet2.jpg"
            alt="Healthy Pets"
            width={38}
            height={38}
            className="rounded-full ring-2 ring-teal-200 dark:ring-teal-800"
          />
          <div className="leading-tight">
            <span className="block text-sm font-bold text-slate-900 dark:text-white">
              Healthy<span className="text-teal-600 dark:text-teal-400">Pets</span>
            </span>
            <span className="block text-[11px] text-slate-400">Portal del cliente</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-teal-600 text-white"
                  : "text-slate-600 hover:bg-teal-50 hover:text-teal-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <link.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="ml-1 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Salir</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default ClientNavbar;
