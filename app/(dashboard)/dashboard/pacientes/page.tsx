"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { StorageService } from "@/utils/storageService";
import { ButtonStyles, TableStyles, LayoutStyles } from "@/utils/uiTheme";

interface Paciente {
  id: number;
  mascota: {
    nombre: string;
    especie: string;
    raza: string;
    fechaNacimiento: string;
    sexo: string;
    peso: string;
    alergias: string;
    notasMedicas: string;
  };
  dueno: {
    nombre: string;
    telefono: string;
    email: string;
    direccion: string;
  };
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>(() => {
    // Cargar pacientes del localStorage al inicializar
    const savedPacientes = StorageService.getItem<Paciente[]>('pacientes');
    return savedPacientes || [];
  });
  const [form, setForm] = useState<Omit<Paciente, "id">>({
    mascota: {
      nombre: "",
      especie: "",
      raza: "",
      fechaNacimiento: "",
      sexo: "",
      peso: "",
      alergias: "",
      notasMedicas: "",
    },
    dueno: {
      nombre: "",
      telefono: "",
      email: "",
      direccion: "",
    },
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [detallePaciente, setDetallePaciente] = useState<Paciente | null>(null);
  const [openDetalle, setOpenDetalle] = useState(false);

  // Guardar pacientes en localStorage cuando cambien
  useEffect(() => {
    StorageService.setItem('pacientes', pacientes);
  }, [pacientes]);

  const resetForm = () => {
    setForm({
      mascota: {
        nombre: "",
        especie: "",
        raza: "",
        fechaNacimiento: "",
        sexo: "",
        peso: "",
        alergias: "",
        notasMedicas: "",
      },
      dueno: {
        nombre: "",
        telefono: "",
        email: "",
        direccion: "",
      },
    });
  };

  const handleChangeMascota = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      mascota: {
        ...prev.mascota,
        [name]: value,
      },
    }));
  };

  const handleComboboxChangeMascota = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      mascota: {
        ...prev.mascota,
        [name]: value,
      },
    }));
  };

  const handleChangeDueno = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      dueno: {
        ...prev.dueno,
        [name]: value,
      },
    }));
  };

  const handleAdd = () => {
    if (!form.mascota.nombre || !form.mascota.especie || !form.dueno.nombre) return;
    setPacientes([...pacientes, { id: Date.now(), ...form }]);
    resetForm();
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setPacientes(pacientes.filter((p) => p.id !== id));
    if (editId === id) setEditId(null);
  };

  const handleEdit = (paciente: Paciente) => {
    setEditId(paciente.id);
    setForm({ mascota: paciente.mascota, dueno: paciente.dueno });
    setOpen(true);
  };

  const handleUpdate = () => {
    setPacientes(
      pacientes.map((p) =>
        p.id === editId ? { ...p, ...form } : p,
      )
    );
    setEditId(null);
    resetForm();
    setOpen(false);
  };

  return (
    <div className={LayoutStyles.page}>
      <div className={LayoutStyles.container}>
        <h1 className={LayoutStyles.title}>Pacientes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className={ButtonStyles.primary}
              onClick={() => {
                setEditId(null);
                resetForm();
              }}
            >
              Nuevo paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>{editId ? "Editar paciente" : "Nuevo paciente"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="grid gap-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <h2 className="mb-4 text-base font-semibold">Mascota</h2>
                  <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nombre</label>
                  <Input name="nombre" placeholder="Nombre" value={form.mascota.nombre} onChange={handleChangeMascota} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Especie</label>
                  <Combobox
                    name="especie"
                    value={form.mascota.especie}
                    onChange={(value) => handleComboboxChangeMascota("especie", value)}
                    placeholder="Selecciona una especie"
                    options={[
                      { value: "Perros", label: "Perros" },
                      { value: "Gatos", label: "Gatos" },
                      { value: "Conejos", label: "Conejos" },
                      { value: "Hurones", label: "Hurones" },
                      { value: "Canarios", label: "Canarios" },
                      { value: "Periquitos", label: "Periquitos" },
                      { value: "Loros", label: "Loros" },
                      { value: "Hámsters", label: "Hámsters" },
                      { value: "Cobayas (cuyes)", label: "Cobayas (cuyes)" },
                      { value: "Tortugas", label: "Tortugas" },
                      { value: "Reptiles (geckos, iguanas)", label: "Reptiles (geckos, iguanas)" },
                    ]}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Raza</label>
                  <Combobox
                    name="raza"
                    value={form.mascota.raza}
                    onChange={(value) => handleComboboxChangeMascota("raza", value)}
                    placeholder="Selecciona una raza"
                    options={[
                      { value: "Labrador Retriever", label: "Labrador Retriever" },
                      { value: "Golden Retriever", label: "Golden Retriever" },
                      { value: "Poodle (Caniche)", label: "Poodle (Caniche)" },
                      { value: "Bulldog Francés", label: "Bulldog Francés" },
                      { value: "Chihuahua", label: "Chihuahua" },
                      { value: "Shih Tzu", label: "Shih Tzu" },
                      { value: "Pug (Carlino)", label: "Pug (Carlino)" },
                      { value: "Schnauzer", label: "Schnauzer" },
                      { value: "Yorkshire Terrier", label: "Yorkshire Terrier" },
                      { value: "Mestizos", label: "Mestizos" },
                      { value: "Siamés", label: "Siamés" },
                      { value: "Persa", label: "Persa" },
                      { value: "Maine Coon", label: "Maine Coon" },
                      { value: "Bengalí", label: "Bengalí" },
                      { value: "Ragdoll", label: "Ragdoll" },
                    ]}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Fecha de nacimiento</label>
                  <DatePicker
                    name="fechaNacimiento"
                    value={form.mascota.fechaNacimiento}
                    onChange={handleChangeMascota}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Sexo</label>
                  <Combobox
                    name="sexo"
                    value={form.mascota.sexo}
                    onChange={(value) => handleComboboxChangeMascota("sexo", value)}
                    placeholder="Selecciona el sexo"
                    options={[
                      { value: "macho", label: "Macho" },
                      { value: "hembra", label: "Hembra" },
                    ]}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Peso</label>
                  <Input name="peso" placeholder="Peso" value={form.mascota.peso} onChange={handleChangeMascota} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Alergias</label>
                  <Input name="alergias" placeholder="Alergias" value={form.mascota.alergias} onChange={handleChangeMascota} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Notas médicas</label>
                  <Textarea name="notasMedicas" placeholder="Notas médicas" value={form.mascota.notasMedicas} onChange={handleChangeMascota} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="mb-4 text-base font-semibold">Dueño</h2>
              <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nombre</label>
                      <Input name="nombre" placeholder="Nombre" value={form.dueno.nombre} onChange={handleChangeDueno} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Teléfono</label>
                      <Input name="telefono" placeholder="Teléfono" value={form.dueno.telefono} onChange={handleChangeDueno} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input name="email" placeholder="Email" value={form.dueno.email} onChange={handleChangeDueno} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Dirección</label>
                      <Input name="direccion" placeholder="Dirección" value={form.dueno.direccion} onChange={handleChangeDueno} />
                    </div>
                  </div>
                </div>
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
              <TableHead className={TableStyles.headerCell}>Mascota</TableHead>
              <TableHead className={TableStyles.headerCell}>Especie</TableHead>
              <TableHead className={TableStyles.headerCell}>Dueño</TableHead>
              <TableHead className={TableStyles.headerCell}>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pacientes.map((paciente) => (
              <TableRow key={paciente.id} className={TableStyles.row}>
                <TableCell className={TableStyles.bodyCell}>{paciente.mascota.nombre}</TableCell>
                <TableCell className={TableStyles.bodyCell}>{paciente.mascota.especie}</TableCell>
                <TableCell className={TableStyles.bodyCell}>{paciente.dueno.nombre}</TableCell>
                <TableCell className={TableStyles.bodyCell}>
                  <Button 
                    size="sm" 
                    className={ButtonStyles.secondary}
                    onClick={() => {
                      setDetallePaciente(paciente);
                      setOpenDetalle(true);
                    }}
                  >
                    Ver más
                  </Button>
                  <Button 
                    size="sm" 
                    className={ButtonStyles.primary}
                    onClick={() => handleEdit(paciente)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    className={ButtonStyles.destructive}
                    onClick={() => handleDelete(paciente.id)}
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
              <DialogTitle>Detalles del Paciente</DialogTitle>
            </DialogHeader>
            {detallePaciente && (
              <div className="grid gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Mascota</h3>
                  <div className="grid gap-2">
                    <div>
                      <p className="text-sm font-medium">Nombre</p>
                      <p className="text-sm">{detallePaciente.mascota.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Especie</p>
                      <p className="text-sm">{detallePaciente.mascota.especie}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Raza</p>
                      <p className="text-sm">{detallePaciente.mascota.raza || "No especificada"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fecha de nacimiento</p>
                      <p className="text-sm">{detallePaciente.mascota.fechaNacimiento || "No especificada"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sexo</p>
                      <p className="text-sm">{detallePaciente.mascota.sexo || "No especificado"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Peso</p>
                      <p className="text-sm">{detallePaciente.mascota.peso || "No especificado"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Alergias</p>
                      <p className="text-sm">{detallePaciente.mascota.alergias || "Ninguna"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Notas médicas</p>
                      <p className="text-sm">{detallePaciente.mascota.notasMedicas || "Ninguna"}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2">Dueño</h3>
                  <div className="grid gap-2">
                    <div>
                      <p className="text-sm font-medium">Nombre</p>
                      <p className="text-sm">{detallePaciente.dueno.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Teléfono</p>
                      <p className="text-sm">{detallePaciente.dueno.telefono}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm">{detallePaciente.dueno.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dirección</p>
                      <p className="text-sm">{detallePaciente.dueno.direccion || "No especificada"}</p>
                    </div>
                  </div>
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