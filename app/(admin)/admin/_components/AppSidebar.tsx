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
  Syringe,
  ShieldCheck,
  BarChart3,
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
import { useRouter } from "next/navigation";
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
  { title: "Vacunas", url: "/admin/vacunas", icon: Syringe },
  { title: "Vacunación", url: "/admin/vacunacion", icon: ShieldCheck },
  { title: "Servicios", url: "/admin/servicios", icon: ReceiptText },
  { title: "Veterinarios", url: "/admin/veterinarios", icon: Stethoscope },
  { title: "Recepcionistas", url: "/admin/recepcionistas", icon: Headset },
  { title: "Usuarios", url: "/admin/usuarios", icon: CircleUserRound },
  { title: "Reportes", url: "/admin/reportes", icon: BarChart3 },
];

// Secciones ocultas por rol (ruta base).
const HIDDEN_BY_ROLE: Record<string, string[]> = {
  veterinario: ["/admin/clientes", "/admin/veterinarios"],
  recepcionista: ["/admin/recepcionistas"],
};

const AppSidebar = ({ role = "admin" }: { role?: Role }) => {
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
    <Sidebar collapsible="icon" {...hoverProps}>
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin">
                <Image src="/logovet2.jpg" alt="logo" width={20} height={20} />
                <span>Healthy Pets</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú de Acciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Mi cuenta <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
