"use client"

import { Home, ReceiptText, Calendar, BookUser, PawPrint, Syringe, ClipboardList, Stethoscope, FileBarChart, UserCog, Shield, FlaskConical, LogOut, User2, ChevronUp } from "lucide-react"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { useAuthStore } from "@/store/auth-store"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const adminItems = [
  { section: "General", items: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
  ]},
  { section: "Gestión", items: [
    { title: "Usuarios", url: "/dashboard/admin/users", icon: Shield },
    { title: "Veterinarios", url: "/dashboard/admin/veterinarians", icon: Stethoscope },
    { title: "Recepcionistas", url: "/dashboard/admin/receptionists", icon: UserCog },
    { title: "Servicios", url: "/dashboard/admin/services", icon: ReceiptText },
    { title: "Vacunas", url: "/dashboard/admin/vaccines", icon: Syringe },
  ]},
  { section: "Reportes", items: [
    { title: "Reportes", url: "/dashboard/admin/reports", icon: FileBarChart },
  ]},
]

const receptionistItems = [
  { section: "General", items: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
  ]},
  { section: "Gestión", items: [
    { title: "Dueños", url: "/dashboard/receptionist/owners", icon: BookUser },
    { title: "Mascotas", url: "/dashboard/receptionist/pets", icon: PawPrint },
    { title: "Citas", url: "/dashboard/receptionist/appointments", icon: Calendar },
  ]},
  { section: "Reportes", items: [
    { title: "Reportes", url: "/dashboard/receptionist/reports", icon: FileBarChart },
  ]},
]

const veterinarianItems = [
  { section: "General", items: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
  ]},
  { section: "Atención", items: [
    { title: "Mis Citas", url: "/dashboard/veterinarian/appointments", icon: Calendar },
    { title: "Historial Médico", url: "/dashboard/veterinarian/medical-history", icon: ClipboardList },
    { title: "Vacunaciones", url: "/dashboard/veterinarian/vaccinations", icon: Syringe },
  ]},
  { section: "Catálogo", items: [
    { title: "Vacunas", url: "/dashboard/veterinarian/catalog/vaccines", icon: FlaskConical },
  ]},
]

const AppSidebar = () => {
  const { user, logout } = useAuthStore()
  const pathname = usePathname()
  const isAdmin = user?.type === "ADMIN"

  const menuSections = isAdmin ? adminItems : receptionistItems

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Image src="/logovet2.jpg" alt="logo" width={18} height={18} className="rounded" />
                </div>
                <span className="font-bold text-base">Healthy Pets</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {menuSections.map((section) => (
          <SidebarGroup key={section.section}>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              {section.section}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          href={item.url}
                          className={cn(
                            "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                            isActive
                              ? "text-primary bg-primary/10 shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          )}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                          )}
                          <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium truncate">{user?.username ?? "Usuario"}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-48">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {user?.type === "ADMIN" ? "Administrador" : "Trabajador"}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} variant="destructive" className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar