"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";

import { logout } from "@/services/auth/auth";
import { getMyOwner } from "@/services/owners/owners";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ClientNavbar = () => {
  const router = useRouter();
  const [initials, setInitials] = useState("US");

  useEffect(() => {
    getMyOwner().then((owner) => {
      if (owner) {
        const first = owner.nombres?.charAt(0) ?? "";
        const last = owner.apellidos?.charAt(0) ?? "";
        setInitials((first + last).toUpperCase() || "US");
      }
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-teal-100 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
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
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex items-center gap-1 rounded-full p-1 text-slate-500 transition hover:bg-teal-50 hover:text-teal-700 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Menú de usuario"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3.5 w-3.5 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Mi cuenta
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/cliente/perfil" className="cursor-pointer">
                <User className="h-3.5 w-3.5" />
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ClientNavbar;
