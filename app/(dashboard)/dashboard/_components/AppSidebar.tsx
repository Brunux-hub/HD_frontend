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
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Clientes", url: "/dashboard/clientes", icon: BookUser },
  { title: "Mascotas", url: "/dashboard/mascotas", icon: PawPrint },
  { title: "Citas", url: "/dashboard/citas", icon: Calendar },
  { title: "Historial", url: "/dashboard/historial", icon: ClipboardList },
  { title: "Vacunas", url: "/dashboard/vacunas", icon: Syringe },
  { title: "Vacunación", url: "/dashboard/vacunacion", icon: ShieldCheck },
  { title: "Servicios", url: "/dashboard/servicios", icon: ReceiptText },
  { title: "Veterinarios", url: "/dashboard/veterinarios", icon: Stethoscope },
  { title: "Recepcionistas", url: "/dashboard/recepcionistas", icon: Headset },
  { title: "Usuarios", url: "/dashboard/usuarios", icon: CircleUserRound },
  { title: "Reportes", url: "/dashboard/reportes", icon: BarChart3 },
];

// Secciones ocultas por rol (ruta base).
const HIDDEN_BY_ROLE: Record<string, string[]> = {
  veterinarian: ["/dashboard/clientes", "/dashboard/veterinarios"],
  receptionist: ["/dashboard/recepcionistas"],
};

const AppSidebar = ({ role = "worker" }: { role?: Role }) => {
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
              <Link href="/dashboard">
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
