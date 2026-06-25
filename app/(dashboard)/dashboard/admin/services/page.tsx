"use client"

import { useState, useEffect, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Plus, ReceiptText } from "lucide-react"

import { serviceApi } from "@/api/endpoints"
import type { Services } from "@/types/api"

import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const serviceSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive("El precio debe ser positivo"),
  ),
})

type ServiceFormData = z.infer<typeof serviceSchema>

const ServicesPage = () => {
  const [services, setServices] = useState<Services[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Services | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Services | null>(null)

  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: { name: "", description: "", price: "" as unknown as number },
  })

  const fetchServices = useCallback(async () => {
    setLoading(true)
    try {
      const res = await serviceApi.getAll()
      setServices(res.data)
    } catch {
      toast.error("Error al cargar servicios")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const openCreate = () => {
    setEditing(null)
    form.reset({ name: "", description: "", price: "" as unknown as number })
    setDialogOpen(true)
  }

  const openEdit = (service: Services) => {
    setEditing(service)
    form.reset({ name: service.name, description: service.description, price: service.price })
    setDialogOpen(true)
  }

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editing) {
        await serviceApi.update(editing.id_service, data)
        toast.success("Servicio actualizado correctamente")
      } else {
        await serviceApi.create(data)
        toast.success("Servicio creado correctamente")
      }
      setDialogOpen(false)
      fetchServices()
    } catch {
      toast.error(editing ? "Error al actualizar servicio" : "Error al crear servicio")
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await serviceApi.delete(deleteTarget.id_service)
      toast.success("Servicio eliminado correctamente")
      setDeleteTarget(null)
      fetchServices()
    } catch {
      toast.error("Error al eliminar servicio")
    }
  }

  const columns = [
    { key: "name", header: "Nombre" },
    { key: "description", header: "Descripción" },
    {
      key: "price",
      header: "Precio",
      render: (item: Services) => `$${Number(item.price).toFixed(2)}`,
    },
  ]

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando servicios...</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <ReceiptText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Servicios</h1>
            <p className="text-sm text-muted-foreground">Administra los servicios ofrecidos</p>
          </div>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Servicio
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={services}
        searchable
        searchKeys={["name", "description"]}
        onEdit={openEdit}
        onDelete={(s) => setDeleteTarget(s)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifica los datos del servicio" : "Completa los campos para crear un nuevo servicio"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...form.register("name")} placeholder="ej: Consulta general" />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" {...form.register("description")} placeholder="Describe el servicio..." rows={3} />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input id="price" type="number" step="0.01" min="0" {...form.register("price", { valueAsNumber: true })} placeholder="ej: 50.00" />
              {form.formState.errors.price && (
                <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">{editing ? "Guardar cambios" : "Crear servicio"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar el servicio <strong>{deleteTarget?.name}</strong>? Esta acción no se puede deshacer.
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

export default ServicesPage
