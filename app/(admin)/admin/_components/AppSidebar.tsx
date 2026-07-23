'use client'

import {
  Home,
  CircleUserRound,
  ReceiptText,
  Calendar,
  BookUser,
  PawPrint,
  Stethoscope,
  Headset,
  ClipboardList,
  User2,
  ChevronUp,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/services/auth/auth";
import type { Role } from "@/lib/auth";

const items = [
  { title: "Home", url: "/admin", icon: Home },
  { title: "Clientes", url: "/admin/clientes", icon: BookUser },
  { title: "Mascotas", url: "/admin/mascotas", icon: PawPrint },
  { title: "Citas", url: "/admin/citas", icon: Calendar },
  { title: "Historial", url: "/admin/historial", icon: ClipboardList },
  { title: "Servicios", url: "/admin/servicios", icon: ReceiptText },
  { title: "Veterinarios", url: "/admin/veterinarios", icon: Stethoscope },
  { title: "Recepcionistas", url: "/admin/recepcionistas", icon: Headset },
  { title: "Usuarios", url: "/admin/usuarios", icon: CircleUserRound },
];

// Secciones ocultas por rol (ruta base).
const HIDDEN_BY_ROLE: Record<string, string[]> = {
  veterinario: ["/admin/clientes", "/admin/veterinarios"],
  recepcionista: ["/admin/recepcionistas"],
};

const AppSidebar = ({ role = "admin" }: { role?: Role }) => {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { setOpen, isMobile } = useSidebar();

  const hidden = HIDDEN_BY_ROLE[role] ?? [];
  const visibleItems = items.filter((item) => !hidden.includes(item.url));

  const handleLogout = () => {
    logout();
    router.push("/login");
    router.refresh();
  };

  // En desktop: crece al pasar el mouse y se colapsa al salir.
  const hoverProps = isMobile
    ? {}
    : {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
      };

  return (
    <Sidebar
      collapsible="icon"
      className="border-teal-100 dark:border-slate-800"
      {...hoverProps}
    >
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/admin">
                <Image
                  src="/logovet2.jpg"
                  alt="Healthy Pets"
                  width={28}
                  height={28}
                  className="rounded-full ring-2 ring-teal-200 dark:ring-teal-800"
                />
                <div className="leading-tight">
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">
                    Healthy<span className="text-teal-600 dark:text-teal-400">Pets</span>
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    Administrador
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.url === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.url)
                    }
                    className="data-[active=true]:bg-teal-600 data-[active=true]:text-white hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-slate-800"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <User2 />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Admin</span>
                <span className="truncate text-xs">{role}</span>
              </div>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-(--radix-popper-anchor-width)"
          >
            <DropdownMenuItem onClick={handleLogout}>
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;