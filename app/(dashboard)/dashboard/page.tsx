"use client"

import { useAuthStore } from "@/store/auth-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, PawPrint, Stethoscope, Clock, Users, Shield, ReceiptText, FileBarChart, UserCog, Syringe, ArrowRight } from "lucide-react"
import Link from "next/link"

const statCards = [
  { title: "Total Mascotas", value: "—", icon: PawPrint, gradient: "from-sky-500 to-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { title: "Citas Hoy", value: "—", icon: CalendarDays, gradient: "from-teal-400 to-emerald-500", bg: "bg-teal-50 dark:bg-teal-950/30" },
  { title: "Veterinarios Activos", value: "—", icon: Stethoscope, gradient: "from-violet-500 to-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { title: "Citas Pendientes", value: "—", icon: Clock, gradient: "from-amber-400 to-orange-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
]

const adminLinks = [
  { title: "Usuarios", desc: "Administra cuentas y roles del sistema", href: "/dashboard/admin/users", icon: Shield, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400" },
  { title: "Veterinarios", desc: "Gestiona doctores y sus especialidades", href: "/dashboard/admin/veterinarians", icon: Stethoscope, color: "text-purple-600 bg-purple-100 dark:bg-purple-950/50 dark:text-purple-400" },
  { title: "Recepcionistas", desc: "Administra el personal de recepción", href: "/dashboard/admin/receptionists", icon: UserCog, color: "text-rose-600 bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400" },
  { title: "Servicios", desc: "Configura servicios y precios", href: "/dashboard/admin/services", icon: ReceiptText, color: "text-amber-600 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400" },
  { title: "Vacunas", desc: "Mantén el catálogo de vacunas", href: "/dashboard/admin/vaccines", icon: Syringe, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400" },
  { title: "Reportes", desc: "Visualiza estadísticas del sistema", href: "/dashboard/admin/reports", icon: FileBarChart, color: "text-sky-600 bg-sky-100 dark:bg-sky-950/50 dark:text-sky-400" },
]

const receptionistLinks = [
  { title: "Dueños", desc: "Administra los dueños de mascotas", href: "/dashboard/receptionist/owners", icon: Users, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400" },
  { title: "Mascotas", desc: "Registra y administra mascotas", href: "/dashboard/receptionist/pets", icon: PawPrint, color: "text-amber-600 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400" },
  { title: "Citas", desc: "Crea y administra citas", href: "/dashboard/receptionist/appointments", icon: CalendarDays, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400" },
  { title: "Reportes", desc: "Visualiza estadísticas", href: "/dashboard/receptionist/reports", icon: FileBarChart, color: "text-sky-600 bg-sky-100 dark:bg-sky-950/50 dark:text-sky-400" },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const isAdmin = user?.type === "ADMIN"

  if (!user) return null

  const links = isAdmin ? adminLinks : receptionistLinks

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin ? "Panel de Administración" : "Panel de Recepción"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido de nuevo, <span className="font-medium text-foreground">{user.username}</span>
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1.5 gap-1.5">
          {isAdmin ? <Shield className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
          {isAdmin ? "Administrador" : "Recepcionista"}
        </Badge>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card
            key={stat.title}
            className="group relative overflow-hidden border-none shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.04] dark:opacity-[0.08]`} />
            <CardContent className="relative flex items-center gap-4 p-6">
              <div className={`rounded-xl p-3 ${stat.bg} transition-transform duration-300 group-hover:scale-110`}>
                <stat.icon className={`h-5 w-5 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Accesos Rápidos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link key={link.title} href={link.href} className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer border-border/50">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className={`rounded-xl p-3 shrink-0 ${link.color} transition-transform duration-300 group-hover:scale-110`}>
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{link.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1.5 shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}