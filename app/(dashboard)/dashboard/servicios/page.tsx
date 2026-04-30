"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { StorageService } from "@/utils/storageService";
import { ButtonStyles, TableStyles, LayoutStyles } from "@/utils/uiTheme";

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  duracion: string;
  categoria: "consulta" | "cirugia" | "grooming" | "";
  estado: "activo" | "inactivo";
}

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>(() => {
    // Cargar servicios del localStorage al inicializar
    const savedServicios = StorageService.getItem<Servicio[]>('servicios');
    return savedServicios || [];
  });
  const [form, setForm] = useState<Omit<Servicio, "id">>({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
    categoria: "",
    estado: "activo",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [detalleServicio, setDetalleServicio] = useState<Servicio | null>(null);
  const [openDetalle, setOpenDetalle] = useState(false);

  // Guardar servicios en localStorage cuando cambien
  useEffect(() => {
    StorageService.setItem('servicios', servicios);
  }, [servicios]);

  const resetForm = () => {
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      duracion: "",
      categoria: "",
      estado: "activo",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleComboboxChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (!form.nombre || !form.descripcion || !form.precio || !form.duracion || !form.categoria) return;
    setServicios([...servicios, { id: Date.now(), ...form }]);
    resetForm();
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setServicios(servicios.filter((s) => s.id !== id));
    if (editId === id) setEditId(null);
  };

  const handleEdit = (servicio: Servicio) => {
    setEditId(servicio.id);
    setForm({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      duracion: servicio.duracion,
      categoria: servicio.categoria,
      estado: servicio.estado,
    });
    setOpen(true);
  };

  const handleUpdate = () => {
    setServicios(
      servicios.map((s) =>
        s.id === editId ? { ...s, ...form } : s,
      )
    );
    setEditId(null);
    resetForm();
    setOpen(false);
  };

  const toggleEstado = (id: number) => {
    setServicios(
      servicios.map((s) =>
        s.id === id ? { ...s, estado: s.estado === "activo" ? "inactivo" : "activo" } : s
      )
    );
  };

  return (
    <div className={LayoutStyles.page}>
      <div className={LayoutStyles.container}>
        <h1 className={LayoutStyles.title}>Servicios</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className={ButtonStyles.primary}
              onClick={() => {
                setEditId(null);
                resetForm();
              }}
            >
              Nuevo servicio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Editar servicio" : "Nuevo servicio"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Nombre</label>
                <Input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Descripción</label>
                <Textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Precio</label>
                <Input name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Duración (minutos)</label>
                <Input name="duracion" placeholder="Duración (minutos)" value={form.duracion} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Categoría</label>
                <Combobox
                  name="categoria"
                  value={form.categoria}
                  onChange={(value) => handleComboboxChange("categoria", value)}
                  placeholder="Selecciona una categoría"
                  options={[
                    { value: "Consulta", label: "Consulta" },
                    { value: "Cirugia", label: "Cirugía" },
                    { value: "Grooming", label: "Grooming" },
                    { value: "Hospitalización y urgencias", label: "Hospitalización y urgencias" },
                    { value: "Nutrición y dietética", label: "Nutrición y dietética" },
                    { value: "Servicios adicionales", label: "Servicios adicionales" },
                  ]}
                />
              </div>
            </div>

            <DialogFooter>
              {editId ? <Button onClick={handleUpdate}>Actualizar</Button> : <Button onClick={handleAdd}>Agregar</Button>}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Table className={TableStyles.base}>
          <TableHeader className={TableStyles.header}>
            <TableRow>
              <TableHead className={TableStyles.headerCell}>Nombre</TableHead>
              <TableHead className={TableStyles.headerCell}>Precio</TableHead>
              <TableHead className={TableStyles.headerCell}>Duración</TableHead>
              <TableHead className={TableStyles.headerCell}>Estado</TableHead>
              <TableHead className={TableStyles.headerCell}>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicios.map((servicio) => (
              <TableRow key={servicio.id} className={TableStyles.row}>
                <TableCell className={TableStyles.bodyCell}>{servicio.nombre}</TableCell>
                <TableCell className={TableStyles.bodyCell}>{servicio.precio}</TableCell>
                <TableCell className={TableStyles.bodyCell}>{servicio.duracion}</TableCell>
                <TableCell className={TableStyles.bodyCell}>
                  <Button 
                    size="sm" 
                    className={servicio.estado === "activo" ? ButtonStyles.primary : ButtonStyles.secondary}
                    onClick={() => toggleEstado(servicio.id)}
                  >
                    {servicio.estado === "activo" ? "Activo" : "Inactivo"}
                  </Button>
                </TableCell>
                <TableCell className={TableStyles.bodyCell}>
                  <Button 
                    size="sm" 
                    className={ButtonStyles.secondary}
                    onClick={() => {
                      setDetalleServicio(servicio);
                      setOpenDetalle(true);
                    }}
                  >
                    Ver más
                  </Button>
                  <Button 
                    size="sm" 
                    className={ButtonStyles.primary}
                    onClick={() => handleEdit(servicio)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    className={ButtonStyles.destructive}
                    onClick={() => handleDelete(servicio.id)}
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
              <DialogTitle>Detalles del Servicio</DialogTitle>
            </DialogHeader>
            {detalleServicio && (
              <div className="grid gap-3">
                <div>
                  <p className="text-sm font-medium">Nombre</p>
                  <p className="text-sm">{detalleServicio.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Descripción</p>
                  <p className="text-sm">{detalleServicio.descripcion}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Precio</p>
                  <p className="text-sm">{detalleServicio.precio}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Duración</p>
                  <p className="text-sm">{detalleServicio.duracion}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Categoría</p>
                  <p className="text-sm">{detalleServicio.categoria}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Estado</p>
                  <p className="text-sm">{detalleServicio.estado === "activo" ? "Activo" : "Inactivo"}</p>
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