"use client"

import { useState, useEffect, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Plus, Stethoscope } from "lucide-react"

import { veterinarianApi, userApi } from "@/api/endpoints"
import type { Veterinarian, User } from "@/types/api"

import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const vetSchema = z.object({
  names: z.string().min(1, "El nombre es requerido"),
  last_names: z.string().min(1, "Los apellidos son requeridos"),
  number_license: z.string().min(1, "La licencia es requerida"),
  specialty: z.string().min(1, "La especialidad es requerida"),
  email: z.string().email("Email inválido"),
  phone_number: z.string().min(1, "El teléfono es requerido"),
  id_user: z.number(),
})

type VetFormData = z.infer<typeof vetSchema>

const VeterinariansPage = () => {
  const [vets, setVets] = useState<Veterinarian[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Veterinarian | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Veterinarian | null>(null)

  const form = useForm<VetFormData>({
    resolver: zodResolver(vetSchema),
    defaultValues: {
      names: "", last_names: "", number_license: "", specialty: "",
      email: "", phone_number: "", id_user: undefined as unknown as number,
    },
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [vetsRes, usersRes] = await Promise.all([veterinarianApi.getAll(), userApi.getAll()])
      setVets(vetsRes.data)
      setUsers(usersRes.data)
    } catch {
      toast.error("Error al cargar datos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreate = () => {
    setEditing(null)
    form.reset({
      names: "", last_names: "", number_license: "", specialty: "",
      email: "", phone_number: "", id_user: undefined as unknown as number,
    })
    setDialogOpen(true)
  }

  const openEdit = (vet: Veterinarian) => {
    setEditing(vet)
    form.reset({
      names: vet.names,
      last_names: vet.last_names,
      number_license: vet.number_license,
      specialty: vet.specialty,
      email: vet.email,
      phone_number: vet.phone_number,
      id_user: vet.user.id_user,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: VetFormData) => {
    try {
      if (editing) {
        await veterinarianApi.update(editing.id_veterinarian, data)
        toast.success("Veterinario actualizado correctamente")
      } else {
        await veterinarianApi.create(data)
        toast.success("Veterinario creado correctamente")
      }
      setDialogOpen(false)
      fetchData()
    } catch {
      toast.error(editing ? "Error al actualizar veterinario" : "Error al crear veterinario")
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await veterinarianApi.delete(deleteTarget.id_veterinarian)
      toast.success("Veterinario eliminado correctamente")
      setDeleteTarget(null)
      fetchData()
    } catch {
      toast.error("Error al eliminar veterinario")
    }
  }

  const columns = [
    { key: "names", header: "Nombres" },
    { key: "last_names", header: "Apellidos" },
    { key: "number_license", header: "Licencia" },
    { key: "specialty", header: "Especialidad" },
    { key: "email", header: "Email" },
    { key: "phone_number", header: "Teléfono" },
  ]

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando veterinarios...</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Veterinarios</h1>
            <p className="text-sm text-muted-foreground">Administra los veterinarios del sistema</p>
          </div>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Veterinario
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={vets}
        searchable
        searchKeys={["names", "last_names", "specialty", "email"]}
        onEdit={openEdit}
        onDelete={(v) => setDeleteTarget(v)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Veterinario" : "Nuevo Veterinario"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifica los datos del veterinario" : "Completa los campos para registrar un veterinario"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="names">Nombres</Label>
                <Input id="names" {...form.register("names")} placeholder="ej: Juan" />
                {form.formState.errors.names && (
                  <p className="text-sm text-destructive">{form.formState.errors.names.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_names">Apellidos</Label>
                <Input id="last_names" {...form.register("last_names")} placeholder="ej: Pérez" />
                {form.formState.errors.last_names && (
                  <p className="text-sm text-destructive">{form.formState.errors.last_names.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number_license">Número de Licencia</Label>
                <Input id="number_license" {...form.register("number_license")} placeholder="ej: LIC-12345" />
                {form.formState.errors.number_license && (
                  <p className="text-sm text-destructive">{form.formState.errors.number_license.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad</Label>
                <Input id="specialty" {...form.register("specialty")} placeholder="ej: Cirugía" />
                {form.formState.errors.specialty && (
                  <p className="text-sm text-destructive">{form.formState.errors.specialty.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} placeholder="ej: juan@correo.com" />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Teléfono</Label>
                <Input id="phone_number" {...form.register("phone_number")} placeholder="ej: 555-1234" />
                {form.formState.errors.phone_number && (
                  <p className="text-sm text-destructive">{form.formState.errors.phone_number.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="id_user">Usuario asociado</Label>
              <Select
                value={form.watch("id_user")?.toString() ?? ""}
                onValueChange={(v) => form.setValue("id_user", Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un usuario" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id_user} value={u.id_user.toString()}>
                      {u.username} ({u.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.id_user && (
                <p className="text-sm text-destructive">{form.formState.errors.id_user.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">{editing ? "Guardar cambios" : "Crear veterinario"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar al veterinario <strong>{deleteTarget?.names} {deleteTarget?.last_names}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default VeterinariansPage
