"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, PawPrint, LogOut } from "lucide-react";

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
import { logout } from "@/services/auth/auth";

const items = [
  { title: "Inicio", url: "/cliente", icon: Home },
  { title: "Mis Mascotas", url: "/cliente/mascotas", icon: PawPrint },
];

const ClientSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpen, isMobile } = useSidebar();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (url: string) =>
    url === "/cliente" ? pathname === "/cliente" : pathname.startsWith(url);

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
              <Link href="/cliente">
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
                    Portal del cliente
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
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <LogOut />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ClientSidebar;
