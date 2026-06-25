"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
import { Field, FieldGroup, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import SectionHeader from "@/app/(dashboard)/dashboard/_components/SectionHeader"
import { ownerApi } from "@/api/endpoints"
import type { Owner } from "@/types/api"

const ownerSchema = z.object({
  names: z.string().min(1, "El nombre es requerido"),
  last_names: z.string().min(1, "Los apellidos son requeridos"),
  email: z.string().email("Email inválido"),
  phone_number: z.string().min(1, "El teléfono es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
})

type OwnerFormData = z.infer<typeof ownerSchema>

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingOwner, setDeletingOwner] = useState<Owner | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchOwners = useCallback(async () => {
    try {
      setLoading(true)
      const res = await ownerApi.getAll()
      setOwners(res.data)
      setError(null)
    } catch {
      setError("Error al cargar los dueños")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOwners() }, [fetchOwners])

  const openCreate = () => {
    setEditingOwner(null)
    setDialogOpen(true)
  }

  const openEdit = (owner: Owner) => {
    setEditingOwner(owner)
    setDialogOpen(true)
  }

  const openDelete = (owner: Owner) => {
    setDeletingOwner(owner)
    setDeleteOpen(true)
  }

  const handleSubmit = async (data: OwnerFormData) => {
    try {
      setSubmitting(true)
      if (editingOwner) {
        await ownerApi.update(editingOwner.id_owner, data)
        toast.success("Dueño actualizado exitosamente")
      } else {
        await ownerApi.create(data)
        toast.success("Dueño creado exitosamente")
      }
      setDialogOpen(false)
      await fetchOwners()
    } catch {
      toast.error(editingOwner ? "Error al actualizar el dueño" : "Error al crear el dueño")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingOwner) return
    try {
      await ownerApi.delete(deletingOwner.id_owner)
      toast.success("Dueño eliminado exitosamente")
      setDeleteOpen(false)
      setDeletingOwner(null)
      await fetchOwners()
    } catch {
      toast.error("Error al eliminar el dueño")
    }
  }

  const tableData = owners.map(o => ({ ...o, id: o.id_owner }))

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchOwners}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Clientes"
        iconLabel="Dueños"
        title="Listado de dueños"
        description="Vista donde podrás revisar y gestionar los dueños de mascotas"
        action={
          <Button variant="success" onClick={openCreate}>
            <Plus /> Nuevo Dueño
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
            { key: "names", header: "Nombres" },
            { key: "last_names", header: "Apellidos" },
            { key: "email", header: "Email" },
            { key: "phone_number", header: "Teléfono" },
            { key: "address", header: "Dirección" },
          ]}
          data={tableData}
          searchKeys={["names", "last_names", "email"]}
          onEdit={(item) => openEdit(item as unknown as Owner)}
          onDelete={(item) => openDelete(item as unknown as Owner)}
        />
      )}

      <OwnerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={editingOwner ? {
          names: editingOwner.names,
          last_names: editingOwner.last_names,
          email: editingOwner.email,
          phone_number: editingOwner.phone_number,
          address: editingOwner.address,
        } : undefined}
        onSubmit={handleSubmit}
        submitting={submitting}
        mode={editingOwner ? "edit" : "create"}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Dueño</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar a {deletingOwner?.names} {deletingOwner?.last_names}? Esta acción no se puede deshacer.
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

function OwnerFormDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  submitting,
  mode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: OwnerFormData
  onSubmit: (data: OwnerFormData) => Promise<void>
  submitting: boolean
  mode: "create" | "edit"
}) {
  const form = useForm<OwnerFormData>({
    resolver: zodResolver(ownerSchema),
    defaultValues: defaultValues ?? { names: "", last_names: "", email: "", phone_number: "", address: "" },
  })

  useEffect(() => {
    if (open) {
      form.reset(defaultValues ?? { names: "", last_names: "", email: "", phone_number: "", address: "" })
    }
  }, [open, defaultValues, form])

  const handleFormSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nuevo Dueño" : "Editar Dueño"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Completa los datos del nuevo dueño" : "Modifica los datos del dueño"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="sr-only">Datos del dueño</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="names">Nombres</FieldLabel>
                  <Input id="names" aria-invalid={!!form.formState.errors.names ? "true" : undefined} {...form.register("names")} placeholder="Ej. Juan" />
                  {form.formState.errors.names && (
                    <p className="text-sm text-destructive">{form.formState.errors.names.message}</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="last_names">Apellidos</FieldLabel>
                  <Input id="last_names" aria-invalid={!!form.formState.errors.last_names ? "true" : undefined} {...form.register("last_names")} placeholder="Ej. Pérez" />
                  {form.formState.errors.last_names && (
                    <p className="text-sm text-destructive">{form.formState.errors.last_names.message}</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" type="email" aria-invalid={!!form.formState.errors.email ? "true" : undefined} {...form.register("email")} placeholder="correo@ejemplo.com" />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone_number">Teléfono</FieldLabel>
                  <Input id="phone_number" aria-invalid={!!form.formState.errors.phone_number ? "true" : undefined} {...form.register("phone_number")} placeholder="Ej. 987654321" />
                  {form.formState.errors.phone_number && (
                    <p className="text-sm text-destructive">{form.formState.errors.phone_number.message}</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="address">Dirección</FieldLabel>
                  <Input id="address" aria-invalid={!!form.formState.errors.address ? "true" : undefined} {...form.register("address")} placeholder="Av. Principal 123" />
                  {form.formState.errors.address && (
                    <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
                  )}
                </Field>
                <Field orientation="horizontal" className="justify-end gap-4">
                  <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="animate-spin" />}
                    {mode === "create" ? "Guardar" : "Actualizar"}
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
