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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import SectionHeader from "@/app/(dashboard)/dashboard/_components/SectionHeader"
import { petApi, ownerApi } from "@/api/endpoints"
import type { Pet, Owner } from "@/types/api"

const petSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  species: z.string().min(1, "La especie es requerida"),
  race: z.string().min(1, "La raza es requerida"),
  birthdate: z.string().min(1, "La fecha de nacimiento es requerida"),
  sex: z.enum(["MALE", "FEMALE"]),
  weight: z.string().min(1, "El peso es requerido"),
  id_owner: z.string().min(1, "El dueño es requerido"),
})

type PetFormData = z.infer<typeof petSchema>

const SEX_OPTIONS = [
  { value: "MALE", label: "Macho" },
  { value: "FEMALE", label: "Hembra" },
]

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingPet, setDeletingPet] = useState<Pet | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [petsRes, ownersRes] = await Promise.all([petApi.getAll(), ownerApi.getAll()])
      setPets(petsRes.data)
      setOwners(ownersRes.data)
      setError(null)
    } catch {
      setError("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => {
    setEditingPet(null)
    setDialogOpen(true)
  }

  const openEdit = (pet: Pet) => {
    setEditingPet(pet)
    setDialogOpen(true)
  }

  const openDelete = (pet: Pet) => {
    setDeletingPet(pet)
    setDeleteOpen(true)
  }

  const handleSubmit = async (data: PetFormData) => {
    try {
      setSubmitting(true)
      const payload = {
        name: data.name,
        species: data.species,
        race: data.race,
        birthdate: data.birthdate,
        sex: data.sex,
        weight: data.weight,
        id_owner: Number(data.id_owner),
      } as Parameters<typeof petApi.create>[0] & { id_owner: number }
      if (editingPet) {
        await petApi.update(editingPet.id_pet, payload)
        toast.success("Mascota actualizada exitosamente")
      } else {
        await petApi.create(payload)
        toast.success("Mascota creada exitosamente")
      }
      setDialogOpen(false)
      await fetchData()
    } catch {
      toast.error(editingPet ? "Error al actualizar la mascota" : "Error al crear la mascota")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingPet) return
    try {
      await petApi.delete(deletingPet.id_pet)
      toast.success("Mascota eliminada exitosamente")
      setDeleteOpen(false)
      setDeletingPet(null)
      await fetchData()
    } catch {
      toast.error("Error al eliminar la mascota")
    }
  }

  const tableData = pets.map(p => ({
    ...p,
    id: p.id_pet,
    owner_name: `${p.owner.names} ${p.owner.last_names}`,
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
        iconName="Icono Mascotas"
        iconLabel="Mascotas"
        title="Listado general de mascotas"
        description="Vista general de pacientes con su dueño principal"
        action={
          <Button variant="success" onClick={openCreate}>
            <Plus /> Nueva Mascota
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
            { key: "name", header: "Nombre" },
            { key: "species", header: "Especie" },
            { key: "race", header: "Raza" },
            { key: "birthdate", header: "Fecha Nac." },
            {
              key: "sex",
              header: "Sexo",
              render: (item) => item.sex === "MALE" ? "Macho" : "Hembra",
            },
            { key: "weight", header: "Peso" },
            { key: "owner_name", header: "Dueño" },
          ]}
          data={tableData}
          searchKeys={["name", "owner_name"]}
          onEdit={(item) => openEdit(item as unknown as Pet)}
          onDelete={(item) => openDelete(item as unknown as Pet)}
        />
      )}

      <PetFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={editingPet ? {
          name: editingPet.name,
          species: editingPet.species,
          race: editingPet.race,
          birthdate: editingPet.birthdate,
          sex: editingPet.sex,
          weight: editingPet.weight,
          id_owner: String(editingPet.owner.id_owner),
        } : undefined}
        onSubmit={handleSubmit}
        submitting={submitting}
        mode={editingPet ? "edit" : "create"}
        owners={owners}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Mascota</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar a {deletingPet?.name}? Esta acción no se puede deshacer.
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

function PetFormDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  submitting,
  mode,
  owners,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: PetFormData
  onSubmit: (data: PetFormData) => Promise<void>
  submitting: boolean
  mode: "create" | "edit"
  owners: Owner[]
}) {
  const form = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: defaultValues ?? {
      name: "", species: "", race: "", birthdate: "", sex: "MALE", weight: "", id_owner: "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(defaultValues ?? {
        name: "", species: "", race: "", birthdate: "", sex: "MALE", weight: "", id_owner: "",
      })
    }
  }, [open, defaultValues, form])

  const handleFormSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nueva Mascota" : "Editar Mascota"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Completa los datos de la nueva mascota" : "Modifica los datos de la mascota"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="sr-only">Datos de la mascota</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nombre</FieldLabel>
                  <Input id="name" aria-invalid={!!form.formState.errors.name ? "true" : undefined} {...form.register("name")} placeholder="Ej. Max" />
                  {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="species">Especie</FieldLabel>
                  <Input id="species" aria-invalid={!!form.formState.errors.species ? "true" : undefined} {...form.register("species")} placeholder="Ej. Perro" />
                  {form.formState.errors.species && <p className="text-sm text-destructive">{form.formState.errors.species.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="race">Raza</FieldLabel>
                  <Input id="race" aria-invalid={!!form.formState.errors.race ? "true" : undefined} {...form.register("race")} placeholder="Ej. Labrador" />
                  {form.formState.errors.race && <p className="text-sm text-destructive">{form.formState.errors.race.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="birthdate">Fecha de Nacimiento</FieldLabel>
                  <Input id="birthdate" type="date" aria-invalid={!!form.formState.errors.birthdate ? "true" : undefined} {...form.register("birthdate")} />
                  {form.formState.errors.birthdate && <p className="text-sm text-destructive">{form.formState.errors.birthdate.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="sex">Sexo</FieldLabel>
                  <select
                    id="sex"
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    {...form.register("sex")}
                  >
                    {SEX_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {form.formState.errors.sex && <p className="text-sm text-destructive">{form.formState.errors.sex.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="weight">Peso</FieldLabel>
                  <Input id="weight" aria-invalid={!!form.formState.errors.weight ? "true" : undefined} {...form.register("weight")} placeholder="Ej. 25.5" />
                  {form.formState.errors.weight && <p className="text-sm text-destructive">{form.formState.errors.weight.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="id_owner">Dueño</FieldLabel>
                  <select
                    id="id_owner"
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    {...form.register("id_owner")}
                  >
                    <option value="">Seleccionar dueño</option>
                    {owners.map(o => (
                      <option key={o.id_owner} value={o.id_owner}>{o.names} {o.last_names}</option>
                    ))}
                  </select>
                  {form.formState.errors.id_owner && <p className="text-sm text-destructive">{form.formState.errors.id_owner.message}</p>}
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
