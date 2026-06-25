"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import SectionHeader from "@/app/(dashboard)/dashboard/_components/SectionHeader"
import { reportApi } from "@/api/endpoints"
import type { Appointment, AppointmentStatus, MedicalHistory } from "@/types/api"

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; variant: "warning" | "success" | "destructive" | "default" }> = {
  OPENED: { label: "Abierta", variant: "warning" },
  CLOSED: { label: "Cerrada", variant: "success" },
  CANCELED: { label: "Cancelada", variant: "destructive" },
  RESCHEDULED: { label: "Reprogramada", variant: "default" },
}

const STATUS_OPTIONS: { value: AppointmentStatus | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "OPENED", label: "Abiertas" },
  { value: "CLOSED", label: "Cerradas" },
  { value: "CANCELED", label: "Canceladas" },
  { value: "RESCHEDULED", label: "Reprogramadas" },
]

export default function ReportsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [completedServices, setCompletedServices] = useState<MedicalHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [appointmentsLoading, setAppointmentsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "">("")

  const fetchCompletedServices = useCallback(async () => {
    try {
      const res = await reportApi.completedServices()
      setCompletedServices(res.data)
    } catch {
      toast.error("Error al cargar servicios completados")
    }
  }, [])

  const fetchAppointments = useCallback(async (status?: AppointmentStatus) => {
    try {
      setAppointmentsLoading(true)
      const res = await reportApi.appointmentsByStatus(status)
      setAppointments(res.data)
    } catch {
      toast.error("Error al cargar citas por estado")
    } finally {
      setAppointmentsLoading(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchCompletedServices(),
      fetchAppointments(),
    ]).finally(() => setLoading(false))
  }, [fetchCompletedServices, fetchAppointments])

  useEffect(() => {
    fetchAppointments(statusFilter || undefined)
  }, [statusFilter, fetchAppointments])

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy HH:mm")
    } catch {
      return dateStr
    }
  }

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Servicios"
        iconLabel="Reportes"
        title="Reportes"
        description="Visualiza reportes de citas y servicios completados"
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => { setLoading(true); Promise.all([fetchCompletedServices(), fetchAppointments()]).finally(() => setLoading(false)) }}>
            Reintentar
          </Button>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Citas por Estado</CardTitle>
                  <CardDescription>Filtra y visualiza las citas según su estado</CardDescription>
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as AppointmentStatus | "")}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No se encontraron citas</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Mascota</TableHead>
                      <TableHead>Dueño</TableHead>
                      <TableHead>Veterinario</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map(a => (
                      <TableRow key={a.id_appointment}>
                        <TableCell>{formatDate(a.date)}</TableCell>
                        <TableCell>{a.pet.name}</TableCell>
                        <TableCell>{a.pet.owner.names} {a.pet.owner.last_names}</TableCell>
                        <TableCell>{a.veterinarian.names} {a.veterinarian.last_names}</TableCell>
                        <TableCell>
                          <Badge variant={STATUS_CONFIG[a.status]?.variant ?? "default"}>
                            {STATUS_CONFIG[a.status]?.label ?? a.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {!appointmentsLoading && appointments.length > 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Total: {appointments.length} cita{appointments.length !== 1 ? "s" : ""}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Servicios Completados</CardTitle>
              <CardDescription>Historial de servicios médicos completados</CardDescription>
            </CardHeader>
            <CardContent>
              {completedServices.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No hay servicios completados</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Mascota</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Veterinario</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedServices.map(mh => (
                      <TableRow key={mh.id_medical_history}>
                        <TableCell>{formatDate(mh.date)}</TableCell>
                        <TableCell>{mh.appointment.pet.name}</TableCell>
                        <TableCell>{mh.services.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{mh.description}</TableCell>
                        <TableCell>{mh.appointment.veterinarian.names} {mh.appointment.veterinarian.last_names}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {completedServices.length > 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Total: {completedServices.length} servicio{completedServices.length !== 1 ? "s" : ""}
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}


