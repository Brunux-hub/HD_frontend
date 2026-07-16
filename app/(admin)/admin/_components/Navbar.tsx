"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, Sun, Moon, User, Bell } from "lucide-react";
import { logout } from "@/services/auth/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

const LABEL_MAP: Record<string, string> = {
  admin: "Inicio",
  clientes: "Clientes",
  mascotas: "Mascotas",
  citas: "Citas",
  historial: "Historial",
  servicios: "Servicios",
  veterinarios: "Veterinarios",
  recepcionistas: "Recepcionistas",
  usuarios: "Usuarios",
};

const Navbar = () => {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const router = useRouter();

  const segs = pathname.split("/").filter(Boolean);
  const breadcrumbs = segs.map((seg, i) => ({
    label: LABEL_MAP[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segs.slice(0, i + 1).join("/"),
    isLast: i === segs.length - 1,
  }));

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between border-b border-border bg-card px-4 h-14">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((b, i) => (
              <span key={b.href} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-xs text-muted-foreground/40">/</span>}
                {b.isLast ? (
                  <span className="font-medium text-foreground">{b.label}</span>
                ) : (
                  <Link href={b.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {b.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
          <Bell className="h-[1.1rem] w-[1.1rem]" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <Sun className="h-[1.1rem] w-[1.1rem] scale-100 dark:scale-0" />
              <Moon className="absolute h-[1.1rem] w-[1.1rem] scale-0 dark:scale-100" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Oscuro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-3.5 w-3.5" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
