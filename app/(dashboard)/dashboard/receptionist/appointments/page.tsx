"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Loader2, Check, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"

import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import SectionHeader from "@/app/(dashboard)/dashboard/_components/SectionHeader"
import { appointmentApi, petApi, veterinarianApi } from "@/api/endpoints"
import type { Appointment, Pet, Veterinarian, AppointmentStatus } from "@/types/api"

const createAppointmentSchema = z.object({
  id_pet: z.string().min(1, "La mascota es requerida"),
  date: z.string().min(1, "La fecha es requerida"),
  id_veterinarian: z.string().min(1, "El veterinario es requerido"),
  time_minutes: z.string().min(1, "El tiempo es requerido"),
  reason: z.string().min(1, "El motivo es requerido"),
})

const editAppointmentSchema = z.object({
  date: z.string().min(1, "La fecha es requerida"),
  time_minutes: z.string().min(1, "El tiempo es requerido"),
  reason: z.string().min(1, "El motivo es requerido"),
  notes: z.string().optional(),
  status: z.enum(["OPENED", "CLOSED", "CANCELED", "RESCHEDULED"]),
})

type CreateFormData = z.infer<typeof createAppointmentSchema>
type EditFormData = z.infer<typeof editAppointmentSchema>

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; variant: "warning" | "success" | "destructive" | "default" }> = {
  OPENED: { label: "Abierta", variant: "warning" },
  CLOSED: { label: "Cerrada", variant: "success" },
  CANCELED: { label: "Cancelada", variant: "destructive" },
  RESCHEDULED: { label: "Reprogramada", variant: "default" },
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null)

  const [submitting, setSubmitting] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [appRes, petRes] = await Promise.all([
        appointmentApi.getAll(),
        petApi.getAll(),
      ])
      setAppointments(appRes.data)
      setPets(petRes.data)
      setError(null)
    } catch {
      setError("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openEdit = (app: Appointment) => {
    setEditingAppointment(app)
    setEditOpen(true)
  }

  const openDelete = (app: Appointment) => {
    setDeletingAppointment(app)
    setDeleteOpen(true)
  }

  const handleCreate = async (data: CreateFormData) => {
    try {
      setSubmitting(true)
      await appointmentApi.create({
        id_pet: Number(data.id_pet),
        date: data.date,
        id_veterinarian: Number(data.id_veterinarian),
        time_minutes: Number(data.time_minutes),
        reason: data.reason,
      } as Parameters<typeof appointmentApi.create>[0] & { id_pet: number; id_veterinarian: number })
      toast.success("Cita creada exitosamente")
      setCreateOpen(false)
      await fetchData()
    } catch {
      toast.error("Error al crear la cita")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (data: EditFormData) => {
    if (!editingAppointment) return
    try {
      setSubmitting(true)
      await appointmentApi.update(editingAppointment.id_appointment, {
        date: data.date,
        time_minutes: Number(data.time_minutes),
        reason: data.reason,
        notes: data.notes ?? "",
        status: data.status,
      })
      toast.success("Cita actualizada exitosamente")
      setEditOpen(false)
      setEditingAppointment(null)
      await fetchData()
    } catch {
      toast.error("Error al actualizar la cita")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingAppointment) return
    try {
      await appointmentApi.delete(deletingAppointment.id_appointment)
      toast.success("Cita eliminada exitosamente")
      setDeleteOpen(false)
      setDeletingAppointment(null)
      await fetchData()
    } catch {
      toast.error("Error al eliminar la cita")
    }
  }

  const handleStatusChange = async (appointment: Appointment, newStatus: AppointmentStatus) => {
    try {
      await appointmentApi.update(appointment.id_appointment, { status: newStatus })
      toast.success("Estado actualizado a " + STATUS_CONFIG[newStatus].label)
      await fetchData()
    } catch {
      toast.error("Error al actualizar el estado")
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy")
    } catch {
      return dateStr
    }
  }

  const tableData = appointments.map(a => ({
    ...a,
    id: a.id_appointment,
    pet_name: a.pet.name,
    owner_name: `${a.pet.owner.names} ${a.pet.owner.last_names}`,
    veterinarian_name: `${a.veterinarian.names} ${a.veterinarian.last_names}`,
    formatted_date: formatDate(a.date),
  }))

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchData}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Citas"
        iconLabel="Citas"
        title="Listado de citas"
        description="Vista donde podrás revisar y gestionar las citas veterinarias"
        action={
          <Button variant="success" onClick={() => setCreateOpen(true)}>
            <Plus /> Nueva Cita
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-60" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <DataTable
          columns={[
            { key: "formatted_date", header: "Fecha" },
            { key: "pet_name", header: "Mascota" },
            { key: "owner_name", header: "Dueño" },
            { key: "veterinarian_name", header: "Veterinario" },
            { key: "reason", header: "Motivo" },
            {
              key: "status",
              header: "Estado",
              render: (item) => {
                const config = STATUS_CONFIG[item.status as AppointmentStatus] ?? STATUS_CONFIG.OPENED
                return <Badge variant={config.variant}>{config.label}</Badge>
              },
            },
            { key: "time_minutes", header: "Minutos" },
          ]}
          data={tableData}
          searchKeys={["pet_name", "owner_name", "veterinarian_name", "reason"]}
          onEdit={(item) => openEdit(item as unknown as Appointment)}
          onDelete={(item) => openDelete(item as unknown as Appointment)}
        />
      )}

      <CreateAppointmentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        submitting={submitting}
        pets={pets}
      />

      <EditAppointmentDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        appointment={editingAppointment}
        onSubmit={handleEdit}
        submitting={submitting}
        onStatusChange={handleStatusChange}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Cita</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar la cita de {deletingAppointment?.pet.name} del {deletingAppointment ? formatDate(deletingAppointment.date) : ""}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PetCombobox({
  value,
  onChange,
  pets,
  error,
}: {
  value: string
  onChange: (value: string) => void
  pets: Pet[]
  error?: string
}) {
  const [open, setOpen] = useState(false)
  const selectedPet = pets.find(p => String(p.id_pet) === value)

  return (
    <div className="space-y-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedPet
              ? `${selectedPet.name} - ${selectedPet.owner.names} ${selectedPet.owner.last_names}`
              : "Seleccionar mascota"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Buscar mascota..." />
            <CommandList>
              <CommandEmpty>No se encontraron mascotas</CommandEmpty>
              <CommandGroup>
                {pets.map(pet => (
                  <CommandItem
                    key={pet.id_pet}
                    value={`${pet.name} ${pet.owner.names} ${pet.owner.last_names}`}
                    onSelect={() => {
                      onChange(String(pet.id_pet))
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(pet.id_pet) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {pet.name} - {pet.owner.names} {pet.owner.last_names}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function CreateAppointmentDialog({
  open,
  onOpenChange,
  onSubmit,
  submitting,
  pets,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateFormData) => Promise<void>
  submitting: boolean
  pets: Pet[]
}) {
  const form = useForm<CreateFormData>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: { id_pet: "", date: "", id_veterinarian: "", time_minutes: "", reason: "" },
  })

  const [availableVets, setAvailableVets] = useState<Veterinarian[]>([])
  const [loadingVets, setLoadingVets] = useState(false)

  const selectedDate = form.watch("date")

  useEffect(() => {
    if (!selectedDate) {
      setAvailableVets([])
      return
    }
    setLoadingVets(true)
    veterinarianApi.getAvailable(selectedDate)
      .then(res => setAvailableVets(res.data))
      .catch(() => toast.error("Error al cargar veterinarios disponibles"))
      .finally(() => setLoadingVets(false))
  }, [selectedDate])

  useEffect(() => {
    if (open) {
      form.reset({ id_pet: "", date: "", id_veterinarian: "", time_minutes: "", reason: "" })
      setAvailableVets([])
    }
  }, [open, form])

  const handleFormSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Cita</DialogTitle>
          <DialogDescription>Completa los datos para agendar una nueva cita</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="sr-only">Datos de la cita</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel>Mascota</FieldLabel>
                  <PetCombobox
                    value={form.watch("id_pet")}
                    onChange={(val) => form.setValue("id_pet", val, { shouldValidate: true })}
                    pets={pets}
                    error={form.formState.errors.id_pet?.message}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="create-date">Fecha</FieldLabel>
                  <Input id="create-date" type="date" {...form.register("date")} />
                  {form.formState.errors.date && <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="create-vet">Veterinario</FieldLabel>
                  <select
                    id="create-vet"
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    {...form.register("id_veterinarian")}
                    disabled={!selectedDate || loadingVets}
                  >
                    <option value="">
                      {loadingVets ? "Cargando..." : !selectedDate ? "Selecciona una fecha primero" : "Seleccionar veterinario"}
                    </option>
                    {availableVets.map(v => (
                      <option key={v.id_veterinarian} value={v.id_veterinarian}>
                        {v.names} {v.last_names} - {v.specialty}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.id_veterinarian && <p className="text-sm text-destructive">{form.formState.errors.id_veterinarian.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="create-time">Tiempo (minutos)</FieldLabel>
                  <Input id="create-time" type="number" min={1} {...form.register("time_minutes")} placeholder="Ej. 30" />
                  {form.formState.errors.time_minutes && <p className="text-sm text-destructive">{form.formState.errors.time_minutes.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="create-reason">Motivo</FieldLabel>
                  <Textarea id="create-reason" {...form.register("reason")} placeholder="Motivo de la consulta" />
                  {form.formState.errors.reason && <p className="text-sm text-destructive">{form.formState.errors.reason.message}</p>}
                </Field>
                <Field orientation="horizontal" className="justify-end gap-4">
                  <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="animate-spin" />}
                    Guardar
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditAppointmentDialog({
  open,
  onOpenChange,
  appointment,
  onSubmit,
  submitting,
  onStatusChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  onSubmit: (data: EditFormData) => Promise<void>
  submitting: boolean
  onStatusChange: (appointment: Appointment, status: AppointmentStatus) => Promise<void>
}) {
  const form = useForm<EditFormData>({
    resolver: zodResolver(editAppointmentSchema),
    defaultValues: { date: "", time_minutes: "", reason: "", notes: "", status: "OPENED" },
  })

  useEffect(() => {
    if (open && appointment) {
      form.reset({
        date: appointment.date,
        time_minutes: String(appointment.time_minutes),
        reason: appointment.reason,
        notes: appointment.notes ?? "",
        status: appointment.status,
      })
    }
  }, [open, appointment, form])

  const handleFormSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  const currentStatus = form.watch("status") as AppointmentStatus

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cita</DialogTitle>
          <DialogDescription>Modifica los datos de la cita</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 pb-2">
          <span className="text-sm text-muted-foreground">Cambiar estado:</span>
          {appointment && (["CLOSED", "CANCELED", "RESCHEDULED"] as AppointmentStatus[]).map(status => {
            const config = STATUS_CONFIG[status]
            return (
              <Button
                key={status}
                size="xs"
                variant={currentStatus === status ? "default" : "outline"}
                onClick={() => {
                  form.setValue("status", status)
                  onStatusChange(appointment, status)
                }}
              >
                {config.label}
              </Button>
            )
          })}
        </div>

        <form onSubmit={handleFormSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="sr-only">Editar cita</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="edit-date">Fecha</FieldLabel>
                  <Input id="edit-date" type="date" {...form.register("date")} />
                  {form.formState.errors.date && <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-time">Tiempo (minutos)</FieldLabel>
                  <Input id="edit-time" type="number" min={1} {...form.register("time_minutes")} />
                  {form.formState.errors.time_minutes && <p className="text-sm text-destructive">{form.formState.errors.time_minutes.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-reason">Motivo</FieldLabel>
                  <Textarea id="edit-reason" {...form.register("reason")} />
                  {form.formState.errors.reason && <p className="text-sm text-destructive">{form.formState.errors.reason.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-notes">Notas</FieldLabel>
                  <Textarea id="edit-notes" {...form.register("notes")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-status">Estado</FieldLabel>
                  <select
                    id="edit-status"
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    {...form.register("status")}
                  >
                    {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                      <option key={value} value={value}>{config.label}</option>
                    ))}
                  </select>
                </Field>
                <Field orientation="horizontal" className="justify-end gap-4">
                  <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="animate-spin" />}
                    Actualizar
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
