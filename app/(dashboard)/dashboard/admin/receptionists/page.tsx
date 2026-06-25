"use client"

import { useState, useEffect, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Plus, UserCog } from "lucide-react"

import { receptionistApi, userApi } from "@/api/endpoints"
import type { Receptionist, User } from "@/types/api"

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

const receptionistSchema = z.object({
  names: z.string().min(1, "El nombre es requerido"),
  last_names: z.string().min(1, "Los apellidos son requeridos"),
  email: z.string().email("Email inválido"),
  phone_number: z.string().min(1, "El teléfono es requerido"),
  id_user: z.number(),
})

type ReceptionistFormData = z.infer<typeof receptionistSchema>

const ReceptionistsPage = () => {
  const [receptionists, setReceptionists] = useState<Receptionist[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Receptionist | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Receptionist | null>(null)

  const form = useForm<ReceptionistFormData>({
    resolver: zodResolver(receptionistSchema),
    defaultValues: {
      names: "", last_names: "", email: "", phone_number: "",
      id_user: undefined as unknown as number,
    },
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [recRes, usersRes] = await Promise.all([receptionistApi.getAll(), userApi.getAll()])
      setReceptionists(recRes.data)
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
      names: "", last_names: "", email: "", phone_number: "",
      id_user: undefined as unknown as number,
    })
    setDialogOpen(true)
  }

  const openEdit = (rec: Receptionist) => {
    setEditing(rec)
    form.reset({
      names: rec.names,
      last_names: rec.last_names,
      email: rec.email,
      phone_number: rec.phone_number,
      id_user: rec.user.id_user,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: ReceptionistFormData) => {
    try {
      if (editing) {
        await receptionistApi.update(editing.id_receptionist, data)
        toast.success("Recepcionista actualizado correctamente")
      } else {
        await receptionistApi.create(data)
        toast.success("Recepcionista creado correctamente")
      }
      setDialogOpen(false)
      fetchData()
    } catch {
      toast.error(editing ? "Error al actualizar recepcionista" : "Error al crear recepcionista")
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await receptionistApi.delete(deleteTarget.id_receptionist)
      toast.success("Recepcionista eliminado correctamente")
      setDeleteTarget(null)
      fetchData()
    } catch {
      toast.error("Error al eliminar recepcionista")
    }
  }

  const columns = [
    { key: "names", header: "Nombres" },
    { key: "last_names", header: "Apellidos" },
    { key: "email", header: "Email" },
    { key: "phone_number", header: "Teléfono" },
  ]

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando recepcionistas...</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <UserCog className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Recepcionistas</h1>
            <p className="text-sm text-muted-foreground">Administra los recepcionistas del sistema</p>
          </div>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Recepcionista
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={receptionists}
        searchable
        searchKeys={["names", "last_names", "email"]}
        onEdit={openEdit}
        onDelete={(r) => setDeleteTarget(r)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Recepcionista" : "Nuevo Recepcionista"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifica los datos del recepcionista" : "Completa los campos para registrar un recepcionista"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="names">Nombres</Label>
                <Input id="names" {...form.register("names")} placeholder="ej: María" />
                {form.formState.errors.names && (
                  <p className="text-sm text-destructive">{form.formState.errors.names.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_names">Apellidos</Label>
                <Input id="last_names" {...form.register("last_names")} placeholder="ej: García" />
                {form.formState.errors.last_names && (
                  <p className="text-sm text-destructive">{form.formState.errors.last_names.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} placeholder="ej: maria@correo.com" />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Teléfono</Label>
                <Input id="phone_number" {...form.register("phone_number")} placeholder="ej: 555-5678" />
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
              <Button type="submit">{editing ? "Guardar cambios" : "Crear recepcionista"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar al recepcionista <strong>{deleteTarget?.names} {deleteTarget?.last_names}</strong>? Esta acción no se puede deshacer.
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

export default ReceptionistsPage
