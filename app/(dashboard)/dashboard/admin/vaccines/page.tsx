"use client"

import { useState, useEffect, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Plus, Syringe } from "lucide-react"

import { vaccineApi } from "@/api/endpoints"
import type { Vaccine } from "@/types/api"

import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const vaccineSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  manufacturer: z.string().min(1, "El fabricante es requerido"),
  required_dose: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().int().positive("Debe ser un número positivo"),
  ),
})

type VaccineFormData = z.infer<typeof vaccineSchema>

const VaccinesPage = () => {
  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Vaccine | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Vaccine | null>(null)

  const form = useForm({
    resolver: zodResolver(vaccineSchema),
    defaultValues: {
      name: "", description: "", manufacturer: "", required_dose: "" as unknown as number,
    },
  })

  const fetchVaccines = useCallback(async () => {
    setLoading(true)
    try {
      const res = await vaccineApi.getAll()
      setVaccines(res.data)
    } catch {
      toast.error("Error al cargar vacunas")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVaccines()
  }, [fetchVaccines])

  const openCreate = () => {
    setEditing(null)
    form.reset({
      name: "", description: "", manufacturer: "", required_dose: "" as unknown as number,
    })
    setDialogOpen(true)
  }

  const openEdit = (vaccine: Vaccine) => {
    setEditing(vaccine)
    form.reset({
      name: vaccine.name,
      description: vaccine.description,
      manufacturer: vaccine.manufacturer,
      required_dose: vaccine.required_dose,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editing) {
        await vaccineApi.update(editing.id_vaccine, data)
        toast.success("Vacuna actualizada correctamente")
      } else {
        await vaccineApi.create(data)
        toast.success("Vacuna creada correctamente")
      }
      setDialogOpen(false)
      fetchVaccines()
    } catch {
      toast.error(editing ? "Error al actualizar vacuna" : "Error al crear vacuna")
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await vaccineApi.delete(deleteTarget.id_vaccine)
      toast.success("Vacuna eliminada correctamente")
      setDeleteTarget(null)
      fetchVaccines()
    } catch {
      toast.error("Error al eliminar vacuna")
    }
  }

  const columns = [
    { key: "name", header: "Nombre" },
    { key: "description", header: "Descripción" },
    { key: "manufacturer", header: "Fabricante" },
    {
      key: "required_dose",
      header: "Dosis Requeridas",
    },
  ]

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando vacunas...</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <Syringe className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vacunas</h1>
            <p className="text-sm text-muted-foreground">Administra el catálogo de vacunas</p>
          </div>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Nueva Vacuna
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={vaccines}
        searchable
        searchKeys={["name", "description", "manufacturer"]}
        onEdit={openEdit}
        onDelete={(v) => setDeleteTarget(v)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Vacuna" : "Nueva Vacuna"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifica los datos de la vacuna" : "Completa los campos para registrar una vacuna"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...form.register("name")} placeholder="ej: Rabia" />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" {...form.register("description")} placeholder="Describe la vacuna..." rows={3} />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Fabricante</Label>
                <Input id="manufacturer" {...form.register("manufacturer")} placeholder="ej: Laboratorios XYZ" />
                {form.formState.errors.manufacturer && (
                  <p className="text-sm text-destructive">{form.formState.errors.manufacturer.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="required_dose">Dosis Requeridas</Label>
                <Input id="required_dose" type="number" min="1" step="1" {...form.register("required_dose", { valueAsNumber: true })} placeholder="ej: 2" />
                {form.formState.errors.required_dose && (
                  <p className="text-sm text-destructive">{form.formState.errors.required_dose.message}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">{editing ? "Guardar cambios" : "Crear vacuna"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar la vacuna <strong>{deleteTarget?.name}</strong>? Esta acción no se puede deshacer.
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

export default VaccinesPage
