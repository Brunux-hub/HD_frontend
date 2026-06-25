"use client"

import { useState, useEffect, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Plus, Shield, Eye, EyeOff } from "lucide-react"

import { userApi } from "@/api/endpoints"
import type { User } from "@/types/api"

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

const userSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es requerido"),
  type: z.enum(["ADMIN", "WORKER"]),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (!data.password && !data.confirmPassword) return true
  return data.password === data.confirmPassword
}, { message: "Las contraseñas no coinciden", path: ["confirmPassword"] })

type UserFormData = z.infer<typeof userSchema>

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { username: "", type: "WORKER", password: "", confirmPassword: "" },
  })

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userApi.getAll()
      setUsers(res.data)
    } catch {
      toast.error("Error al cargar usuarios")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const openCreate = () => {
    setEditing(null)
    form.reset({ username: "", type: "WORKER", password: "", confirmPassword: "" })
    setShowPassword(false)
    setDialogOpen(true)
  }

  const openEdit = (user: User) => {
    setEditing(user)
    form.reset({ username: user.username, type: user.type, password: "", confirmPassword: "" })
    setShowPassword(false)
    setDialogOpen(true)
  }

  const onSubmit = async (data: UserFormData) => {
    try {
      if (editing) {
        const payload: { username?: string; type?: "ADMIN" | "WORKER"; password?: string } = {
          username: data.username,
          type: data.type,
        }
        if (data.password) {
          payload.password = data.password
        }
        await userApi.update(editing.id_user, payload)
        toast.success("Usuario actualizado correctamente")
      } else {
        if (!data.password || data.password.length < 6) {
          form.setError("password", { message: "La contraseña debe tener al menos 6 caracteres" })
          return
        }
        await userApi.create({
          username: data.username,
          type: data.type,
          password: data.password,
        })
        toast.success("Usuario creado correctamente")
      }
      setDialogOpen(false)
      fetchUsers()
    } catch {
      toast.error(editing ? "Error al actualizar usuario" : "Error al crear usuario")
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await userApi.delete(deleteTarget.id_user)
      toast.success("Usuario eliminado correctamente")
      setDeleteTarget(null)
      fetchUsers()
    } catch {
      toast.error("Error al eliminar usuario")
    }
  }

  const columns = [
    { key: "id_user", header: "ID" },
    { key: "username", header: "Usuario" },
    { key: "type", header: "Tipo" },
  ]

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando usuarios...</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
            <p className="text-sm text-muted-foreground">Administra los usuarios del sistema</p>
          </div>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Usuario
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchable
        searchKeys={["username", "type"]}
        onEdit={openEdit}
        onDelete={(u) => setDeleteTarget(u)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifica los datos del usuario" : "Completa los campos para crear un nuevo usuario"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input id="username" {...form.register("username")} placeholder="ej: juanperez" />
              {form.formState.errors.username && (
                <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={form.watch("type")}
                onValueChange={(v) => form.setValue("type", v as "ADMIN" | "WORKER")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="WORKER">WORKER</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
              )}
            </div>
            <div className="relative space-y-2">
              <Label htmlFor="password">
                {editing ? "Nueva contraseña (dejar en blanco para mantener actual)" : "Contraseña"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  placeholder={editing ? "Sin cambios" : "Mínimo 6 caracteres"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                {...form.register("confirmPassword")}
                placeholder="Repite la contraseña"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">{editing ? "Guardar cambios" : "Crear usuario"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar al usuario <strong>{deleteTarget?.username}</strong>? Esta acción no se puede deshacer.
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

export default UsersPage
