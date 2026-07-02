'use client'

import {
  Home,
  CircleUserRound,
  ReceiptText,
  Calendar,
  BookUser,
  PawPrint,
  UserRoundCheck,
  SquareUser,
  Settings,
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
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

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Usuarios",
    url: "/dashboard/usuarios",
    icon: CircleUserRound,
  },
  {
    title: "Servicios",
    url: "/dashboard/servicios",
    icon: ReceiptText,
  },
  {
    title: "Citas",
    url: "/dashboard/citas",
    icon: Calendar,
  },
  {
    title: "Clientes",
    url: "/dashboard/clientes",
    icon: BookUser,
  },
  {
    title: "Mascotas",
    url: "/dashboard/mascotas",
    icon: PawPrint,
  },
  {
    title: "Veterinarios",
    url: "/dashboard/veterinarios",
    icon: UserRoundCheck,
  },
  {
    title: "Recepcionistas",
    url: "/dashboard/recepcionistas",
    icon: SquareUser,
  },
  {
    title: "Configuración",
    url: "#",
    icon: Settings,
  },
];

const AppSidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <Sidebar collapsible="icon">
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
          <SidebarGroupLabel>Menu de Acciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.title === "Inbox" && (
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* FOOTER SIDEBAR */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> John Doe <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configuracion</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  Cerrar Sesion
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
