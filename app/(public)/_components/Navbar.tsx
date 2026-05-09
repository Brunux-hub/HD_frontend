"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { MdSunny } from "react-icons/md";
import { RiMoonClearFill } from "react-icons/ri";
import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

const Navbar = () => {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = mounted && resolvedTheme === "dark";

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <>
      <nav className="w-full bg-[#A8F0F2] dark:bg-slate-900">
        {/* Container Navbar */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Container Bloque navbar */}
          <div className="flex justify-between h-14 sm:h-16 md:h-20">
            <div className="flex space-x-2 items-center">
              <div>
                <Image
                  className="mx-auto block rounded-full"
                  src="/logovet2.jpg"
                  alt="logo"
                  width={70}
                  height={70}
                  priority
                />
              </div>
            </div>

            {/* NavLink */}
            <div className="hidden md:flex gap-6 lg:gap-8 items-center">
              <Link
                href="/"
                className="dark:text-gray-400 dark:hover:text-white"
              >
                Inicio
              </Link>
              <Link
                href="#nosotros"
                className="dark:text-gray-400 dark:hover:text-white"
              >
                Nosotros
              </Link>
              <Link
                href="#servicios"
                className="dark:text-gray-400 dark:hover:text-white"
              >
                Servicios
              </Link>
              <Link
                href="#equipo"
                className="dark:text-gray-400 dark:hover:text-white"
              >
                Equipo
              </Link>
              <Link
                href="#contacto"
                className="dark:text-gray-400 dark:hover:text-white"
              >
                Contacto
              </Link>

              <button
                type="button"
                aria-label={
                  isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
                }
                onClick={handleThemeToggle}
              >
                {isDark ? (
                  <RiMoonClearFill className="text-shadow-blue-900" size={32} />
                ) : (
                  <MdSunny className="text-amber-300" size={32} />
                )}
              </button>
            </div>
            <button
              className="md:hidden hover:text-orange-600 dark:text-gray-400 dark:hover:text-white cursor-pointer "
              onClick={() => setMobileMenuIsOpen((prev) => !prev)}
            >
              {mobileMenuIsOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Si la condición de la izquierda es verdadera, entonces muestra lo que está a la derecha */}
        {mobileMenuIsOpen && (
          <div className="md:hidden dark:bg-slate-900 backdrop-blur-lg border-t border-slate-800">
            <div className="px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
              <Link
                href="/"
                className="block dark:text-gray-400 dark:hover:text-white"
                onClick={() => setMobileMenuIsOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="#nosotros"
                className="block dark:text-gray-400 dark:hover:text-white"
                onClick={() => setMobileMenuIsOpen(false)}
              >
                Nosotros
              </Link>
              <Link
                href="#servicios"
                className="block dark:text-gray-400 dark:hover:text-white"
                onClick={() => setMobileMenuIsOpen(false)}
              >
                Servicios
              </Link>
              <Link
                href="#equipo"
                className="block dark:text-gray-400 dark:hover:text-white"
                onClick={() => setMobileMenuIsOpen(false)}
              >
                Equipo
              </Link>
              <Link
                href="#contacto"
                className="block dark:text-gray-400 dark:hover:text-white"
                onClick={() => setMobileMenuIsOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
