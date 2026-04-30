"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Combobox } from "@/components/ui/combobox";
import { StorageService } from "@/utils/storageService";
import { ButtonStyles, TableStyles, LayoutStyles } from "@/utils/uiTheme";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: "Admin" | "Recepción" | "Veterinario";
  telefono: string;
  estado: "activo" | "inactivo";
  especialidad: string;
  horario: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    // Cargar usuarios del localStorage al inicializar
    const savedUsuarios = StorageService.getItem<Usuario[]>('usuarios');
    return savedUsuarios || [];
  });
  const [form, setForm] = useState<Omit<Usuario, "id">>({
    nombre: "",
    email: "",
    password: "",
    rol: "Recepción",
    telefono: "",
    estado: "activo",
    especialidad: "",
    horario: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [detalleUsuario, setDetalleUsuario] = useState<Usuario | null>(null);
  const [openDetalle, setOpenDetalle] = useState(false);

  // Guardar usuarios en localStorage cuando cambien
  useEffect(() => {
    StorageService.setItem('usuarios', usuarios);
  }, [usuarios]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleComboboxChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (!form.nombre || !form.email || !form.password) return;
    setUsuarios([
      ...usuarios,
      { id: Date.now(), ...form, estado: "activo" },
    ]);
    setForm({
      nombre: "",
      email: "",
      password: "",
      rol: "Recepción",
      telefono: "",
      estado: "activo",
      especialidad: "",
      horario: "",
    });
    setOpen(false);
  };

  const toggleEstado = (id: number) => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === id ? { ...u, estado: u.estado === "activo" ? "inactivo" : "activo" } : u
      )
    );
  };

  const handleDelete = (id: number) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
    if (editId === id) setEditId(null);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditId(usuario.id);
    setForm({ ...usuario });
    setOpen(true);
  };

  const handleUpdate = () => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === editId ? { ...u, ...form } : u
      )
    );
    setEditId(null);
    setForm({
      nombre: "",
      email: "",
      password: "",
      rol: "Recepción",
      telefono: "",
      estado: "activo",
      especialidad: "",
      horario: "",
    });
    setOpen(false);
  };

  return (
    <div className={LayoutStyles.page}>
      <div className={LayoutStyles.container}>
        <h1 className={LayoutStyles.title}>Usuarios</h1>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className={ButtonStyles.primary}
              onClick={() => { setEditId(null); setForm({ nombre: "", email: "", password: "", rol: "Recepción", telefono: "", estado: "activo", especialidad: "", horario: "" }); }}
            >
              Nuevo usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Nombre completo</label>
                <Input name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Contraseña</label>
                <Input name="password" placeholder="Contraseña" type="password" value={form.password} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Rol</label>
                <Combobox 
                  name="rol" 
                  value={form.rol} 
                  onChange={(value) => handleComboboxChange("rol", value)} 
                  options={[
                    { value: "Admin", label: "Admin" },
                    { value: "Recepción", label: "Recepción" },
                    { value: "Veterinario", label: "Veterinario" },
                  ]} 
                  placeholder="Selecciona un rol"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Teléfono</label>
                <Input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
              </div>
              {form.rol === "Veterinario" && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Especialidad</label>
                  <Input name="especialidad" placeholder="Especialidad" value={form.especialidad} onChange={handleChange} />
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-1 block">Horario laboral (opcional)</label>
                <Input name="horario" placeholder="Horario laboral (opcional)" value={form.horario} onChange={handleChange} />
              </div>
            </div>
            <DialogFooter>
              {editId ? (
                <Button onClick={handleUpdate}>Actualizar</Button>
              ) : (
                <Button onClick={handleAdd}>Agregar</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Table className={TableStyles.base}>
          <TableHeader className={TableStyles.header}>
            <TableRow>
              <TableHead className={TableStyles.headerCell}>Nombre</TableHead>
              <TableHead className={TableStyles.headerCell}>Email</TableHead>
              <TableHead className={TableStyles.headerCell}>Rol</TableHead>
              <TableHead className={TableStyles.headerCell}>Estado</TableHead>
              <TableHead className={TableStyles.headerCell}>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id} className={TableStyles.row}>
                <TableCell className={TableStyles.bodyCell}>{usuario.nombre}</TableCell>
                <TableCell className={TableStyles.bodyCell}>{usuario.email}</TableCell>
                <TableCell className={TableStyles.bodyCell}>{usuario.rol}</TableCell>
                <TableCell className={TableStyles.bodyCell}>
                  <Button 
                    size="sm" 
                    className={usuario.estado === "activo" ? ButtonStyles.primary : ButtonStyles.secondary}
                    onClick={() => toggleEstado(usuario.id)}
                  >
                    {usuario.estado === "activo" ? "Activo" : "Inactivo"}
                  </Button>
                </TableCell>
                <TableCell className={TableStyles.bodyCell}>
                  <Button 
                    size="sm" 
                    className={ButtonStyles.secondary}
                    onClick={() => {
                      setDetalleUsuario(usuario);
                      setOpenDetalle(true);
                    }}
                  >
                    Ver más
                  </Button>
                  <Button 
                    size="sm" 
                    className={ButtonStyles.primary}
                    onClick={() => handleEdit(usuario)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    className={ButtonStyles.destructive}
                    onClick={() => handleDelete(usuario.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={openDetalle} onOpenChange={setOpenDetalle}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles del Usuario</DialogTitle>
            </DialogHeader>
            {detalleUsuario && (
              <div className="grid gap-3">
                <div>
                  <p className="text-sm font-medium">Nombre</p>
                  <p className="text-sm">{detalleUsuario.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm">{detalleUsuario.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Rol</p>
                  <p className="text-sm">{detalleUsuario.rol}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Teléfono</p>
                  <p className="text-sm">{detalleUsuario.telefono}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Estado</p>
                  <p className="text-sm">{detalleUsuario.estado === "activo" ? "Activo" : "Inactivo"}</p>
                </div>
                {detalleUsuario.rol === "Veterinario" && (
                  <div>
                    <p className="text-sm font-medium">Especialidad</p>
                    <p className="text-sm">{detalleUsuario.especialidad}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">Horario laboral</p>
                  <p className="text-sm">{detalleUsuario.horario || "No especificado"}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setOpenDetalle(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}