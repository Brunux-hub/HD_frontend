"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { FileBarChart, CheckCircle2, Calendar } from "lucide-react"

import { reportApi } from "@/api/endpoints"
import type { MedicalHistory, Appointment, AppointmentStatus } from "@/types/api"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

const statusLabels: Record<AppointmentStatus, string> = {
  OPENED: "Abierta",
  CLOSED: "Cerrada",
  CANCELED: "Cancelada",
  RESCHEDULED: "Reprogramada",
}

const statusColors: Record<AppointmentStatus, string> = {
  OPENED: "bg-blue-100 text-blue-800",
  CLOSED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
  RESCHEDULED: "bg-yellow-100 text-yellow-800",
}

const ReportsPage = () => {
  const [completedServices, setCompletedServices] = useState<MedicalHistory[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingAppointments, setLoadingAppointments] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>("OPENED")

  const fetchCompletedServices = useCallback(async () => {
    setLoadingServices(true)
    try {
      const res = await reportApi.completedServices()
      setCompletedServices(res.data)
    } catch {
      toast.error("Error al cargar servicios completados")
    } finally {
      setLoadingServices(false)
    }
  }, [])

  const fetchAppointmentsByStatus = useCallback(async (status: AppointmentStatus) => {
    setLoadingAppointments(true)
    try {
      const res = await reportApi.appointmentsByStatus(status)
      setAppointments(res.data)
    } catch {
      toast.error("Error al cargar citas")
    } finally {
      setLoadingAppointments(false)
    }
  }, [])

  useEffect(() => {
    fetchCompletedServices()
  }, [fetchCompletedServices])

  useEffect(() => {
    fetchAppointmentsByStatus(selectedStatus)
  }, [selectedStatus, fetchAppointmentsByStatus])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-primary/10 p-3">
          <FileBarChart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
          <p className="text-sm text-muted-foreground">Visualiza estadísticas e información del sistema</p>
        </div>
      </div>

      <Tabs defaultValue="completed-services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="completed-services" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Servicios Completados
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Citas por Estado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="completed-services" className="space-y-4">
          <Card>
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Historial de Servicios Completados</h2>
              <p className="text-sm text-muted-foreground">Registros de servicios realizados en las citas</p>
            </div>
            {loadingServices ? (
              <div className="p-8 text-center text-muted-foreground">Cargando servicios completados...</div>
            ) : completedServices.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No se encontraron servicios completados</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mascota</TableHead>
                      <TableHead>Dueño</TableHead>
                      <TableHead>Veterinario</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Descripción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedServices.map((mh) => (
                      <TableRow key={mh.id_medical_history}>
                        <TableCell className="font-medium">
                          {mh.appointment.pet.name}
                        </TableCell>
                        <TableCell>
                          {mh.appointment.pet.owner.names} {mh.appointment.pet.owner.last_names}
                        </TableCell>
                        <TableCell>
                          {mh.appointment.veterinarian.names} {mh.appointment.veterinarian.last_names}
                        </TableCell>
                        <TableCell>
                          {new Date(mh.date).toLocaleDateString("es-ES", {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{mh.services.name}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {mh.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Citas por Estado</h2>
              <p className="text-sm text-muted-foreground">Filtra las citas según su estado actual</p>
            </div>
            <div className="p-4 border-b flex flex-wrap gap-2">
              {(Object.keys(statusLabels) as AppointmentStatus[]).map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {statusLabels[status]}
                </Button>
              ))}
            </div>
            {loadingAppointments ? (
              <div className="p-8 text-center text-muted-foreground">Cargando citas...</div>
            ) : appointments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No se encontraron citas con estado "{statusLabels[selectedStatus]}"
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mascota</TableHead>
                      <TableHead>Dueño</TableHead>
                      <TableHead>Veterinario</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appt) => (
                      <TableRow key={appt.id_appointment}>
                        <TableCell className="font-medium">
                          {appt.pet.name}
                        </TableCell>
                        <TableCell>
                          {appt.pet.owner.names} {appt.pet.owner.last_names}
                        </TableCell>
                        <TableCell>
                          {appt.veterinarian.names} {appt.veterinarian.last_names}
                        </TableCell>
                        <TableCell>
                          {new Date(appt.date).toLocaleDateString("es-ES", {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          {Math.floor(appt.time_minutes / 60)}:{String(appt.time_minutes % 60).padStart(2, "0")}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {appt.reason}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[appt.status]}>
                            {statusLabels[appt.status]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReportsPage
