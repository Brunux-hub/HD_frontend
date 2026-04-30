
"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToastItem, ToastViewport } from "@/components/ui/toast";

type BadgeVariant = "default" | "success" | "warning" | "danger";

const PETS = [
  { id: "P-01", name: "Luna", species: "Canino", owner: "Ana Lopez", status: "Activo" },
  { id: "P-02", name: "Milo", species: "Felino", owner: "Carlos Perez", status: "Activo" },
  { id: "P-03", name: "Nina", species: "Canino", owner: "Rosa Diaz", status: "Inactivo" },
];

const APPOINTMENTS = [
  {
    id: "C-01",
    date: "2026-04-29 09:30",
    pet: "Luna",
    vet: "Dr. Flores",
    status: "Programada",
  },
  {
    id: "C-02",
    date: "2026-04-30 11:00",
    pet: "Milo",
    vet: "Dra. Soto",
    status: "Confirmada",
  },
  {
    id: "C-03",
    date: "2026-05-01 16:00",
    pet: "Nina",
    vet: "Dr. Flores",
    status: "Cancelada",
  },
];

const HISTORY = [
  {
    pet: "Luna",
    owner: "Ana Lopez",
    lastAppointment: "2026-04-12",
    diagnosis: "Otitis externa",
    treatment: "Limpieza + gotas",
  },
  {
    pet: "Milo",
    owner: "Carlos Perez",
    lastAppointment: "2026-04-10",
    diagnosis: "Gingivitis",
    treatment: "Higiene oral",
  },
];

const DIAGNOSTICS = [
  { id: "D-01", pet: "Luna", vet: "Dr. Flores", summary: "Otitis externa", status: "Pendiente" },
  { id: "D-02", pet: "Milo", vet: "Dra. Soto", summary: "Gingivitis", status: "En curso" },
];

const TREATMENTS = [
  {
    id: "T-01",
    pet: "Luna",
    indication: "Gotas cada 8 horas por 7 dias",
    status: "Activo",
  },
  {
    id: "T-02",
    pet: "Milo",
    indication: "Limpieza oral semanal",
    status: "Pendiente",
  },
];

const USERS = [
  { id: "U-01", name: "Ana Admin", role: "Admin", email: "ana.admin@vet.local", status: "Activo" },
  {
    id: "U-02",
    name: "Ricardo Recepcion",
    role: "Recepcionista",
    email: "ricardo.rec@vet.local",
    status: "Activo",
  },
  {
    id: "U-03",
    name: "Pilar Vet",
    role: "Veterinario",
    email: "pilar.vet@vet.local",
    status: "Inactivo",
  },
];

const SERVICES = [
  { id: "S-01", name: "Consulta general", price: "40.00", status: "Activo" },
  { id: "S-02", name: "Vacunacion", price: "25.00", status: "Activo" },
  { id: "S-03", name: "Peluqueria", price: "30.00", status: "Inactivo" },
];

const PET_OPTIONS = PETS.map((pet) => ({ value: pet.id, label: `${pet.name} (${pet.owner})` }));
const VET_OPTIONS = [
  { value: "vet-01", label: "Dr. Flores" },
  { value: "vet-02", label: "Dra. Soto" },
];
const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "recepcionista", label: "Recepcionista" },
  { value: "veterinario", label: "Veterinario" },
];
const STATUS_OPTIONS = [
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" },
  { value: "pendiente", label: "Pendiente" },
  { value: "programada", label: "Programada" },
  { value: "confirmada", label: "Confirmada" },
  { value: "cancelada", label: "Cancelada" },
];

function statusToBadge(status: string): BadgeVariant {
  const normalized = status.toLowerCase();

  if (normalized.includes("activo") || normalized.includes("confirmada") || normalized.includes("curso")) {
    return "success";
  }

  if (normalized.includes("pendiente") || normalized.includes("programada")) {
    return "warning";
  }

  if (normalized.includes("cancelada") || normalized.includes("inactivo")) {
    return "danger";
  }

  return "default";
}

export default function DashboardPage() {
  const [appointmentPet, setAppointmentPet] = React.useState<string>("");
  const [appointmentVet, setAppointmentVet] = React.useState<string>("");
  const [diagnosisPet, setDiagnosisPet] = React.useState<string>("");
  const [treatmentPet, setTreatmentPet] = React.useState<string>("");
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const closeToast = React.useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = React.useCallback((title: string, description: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setToasts((currentToasts) => [
      ...currentToasts,
      {
        id,
        title,
        description,
        variant: "success",
      },
    ]);

    window.setTimeout(() => {
      closeToast(id);
    }, 3500);
  }, [closeToast]);

  const handleFormSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>, title: string, description: string) => {
      event.preventDefault();
      pushToast(title, description);
      event.currentTarget.reset();
    },
    [pushToast],
  );

  return (
    <section className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-950 min-h-screen">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard operativo
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Vista funcional por roles y acciones principales de cada área.
        </p>
      </header>

      <Tabs defaultValue="recepcionista">
        <TabsList className="grid gap-2 sm:grid-cols-3 rounded-full bg-white/90 border border-slate-200/80 p-1 shadow-sm dark:bg-slate-900/80 dark:border-slate-700">

          <TabsTrigger value="recepcionista">Recepcionista</TabsTrigger>
          <TabsTrigger value="veterinario">Veterinario</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="recepcionista" className="space-y-4">
          <Card className="shadow-sm ring-1 ring-slate-200/80 border border-slate-200/80 dark:ring-slate-700/80 dark:border-slate-800/80">
            <CardHeader>
              <CardTitle>Mascotas / Dueños</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Registrar mascota</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo registro de mascota</DialogTitle>
                  </DialogHeader>
                  <Form
                    onSubmit={(event) =>
                      handleFormSubmit(event, "Mascota registrada", "El registro base de mascota y dueño fue creado")
                    }
                  >
                    <FormField
                      name="petName"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Nombre mascota</FormLabel>
                          <FormControl>
                            <Input id={id} name={name} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="species"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Especie</FormLabel>
                          <FormControl>
                            <Input id={id} name={name} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="owner"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Dueño responsable</FormLabel>
                          <FormControl>
                            <Input id={id} name={name} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="status"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Estado</FormLabel>
                          <FormControl>
                            <Select
                              id={id}
                              name={name}
                              defaultValue="activo"
                              options={STATUS_OPTIONS.filter((option) =>
                                ["activo", "inactivo"].includes(option.value),
                              )}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Guardar</Button>
                    </DialogFooter>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Especie</TableHead>
                    <TableHead>Dueño</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PETS.map((pet) => (
                    <TableRow key={pet.id}>
                      <TableCell>{pet.id}</TableCell>
                      <TableCell>{pet.name}</TableCell>
                      <TableCell>{pet.species}</TableCell>
                      <TableCell>{pet.owner}</TableCell>
                      <TableCell>
                        <Badge variant={statusToBadge(pet.status)}>{pet.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            onClick={() => pushToast("Edicion abierta", `Se abrio edicion para ${pet.name}`)}
                          >
                            Editar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">Eliminar</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Eliminar mascota</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta accion elimina la mascota y su relacion administrativa.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel asChild>
                                  <Button variant="outline">Cancelar</Button>
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  asChild
                                  onClick={() =>
                                    pushToast("Mascota eliminada", `${pet.name} fue eliminada del listado`)
                                  }
                                >
                                  <Button variant="destructive">Confirmar</Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-sm ring-1 ring-slate-200/80 border border-slate-200/80 dark:ring-slate-700/80 dark:border-slate-800/80">
            <CardHeader>
              <CardTitle>Citas</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Programar cita</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nueva cita</DialogTitle>
                  </DialogHeader>
                  <Form
                    onSubmit={(event) => {
                      handleFormSubmit(event, "Cita programada", "La cita fue registrada correctamente");
                      setAppointmentPet("");
                      setAppointmentVet("");
                    }}
                  >
                    <FormField
                      name="pet"
                      render={({ id }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Mascota</FormLabel>
                          <FormControl>
                            <Combobox
                              id={id}
                              name="pet"
                              options={PET_OPTIONS}
                              value={appointmentPet}
                              onChange={setAppointmentPet}
                              placeholder="Buscar mascota"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="vet"
                      render={({ id }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Veterinario</FormLabel>
                          <FormControl>
                            <Combobox
                              id={id}
                              name="vet"
                              options={VET_OPTIONS}
                              value={appointmentVet}
                              onChange={setAppointmentVet}
                              placeholder="Buscar veterinario"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="date"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Fecha y hora</FormLabel>
                          <FormControl>
                            <DatePicker id={id} name={name} mode="datetime-local" required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="status"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Estado</FormLabel>
                          <FormControl>
                            <Select
                              id={id}
                              name={name}
                              defaultValue="programada"
                              options={STATUS_OPTIONS.filter((option) =>
                                ["programada", "confirmada", "cancelada"].includes(option.value),
                              )}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="notes"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Notas</FormLabel>
                          <FormControl>
                            <Textarea id={id} name={name} rows={3} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Guardar cita</Button>
                    </DialogFooter>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Veterinario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {APPOINTMENTS.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.pet}</TableCell>
                      <TableCell>{appointment.vet}</TableCell>
                      <TableCell>
                        <Badge variant={statusToBadge(appointment.status)}>{appointment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            onClick={() =>
                              pushToast("Cita en edicion", `Se abrio reprogramacion para ${appointment.id}`)
                            }
                          >
                            Reprogramar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">Eliminar</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Eliminar cita</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta accion elimina la cita del calendario.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel asChild>
                                  <Button variant="outline">Cancelar</Button>
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  asChild
                                  onClick={() =>
                                    pushToast("Cita eliminada", `La cita ${appointment.id} fue eliminada`)
                                  }
                                >
                                  <Button variant="destructive">Confirmar</Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="veterinario" className="space-y-4">
          <Card className="shadow-sm ring-1 ring-slate-200/80 border border-slate-200/80 dark:ring-slate-700/80 dark:border-slate-800/80">
            <CardHeader>
              <CardTitle>Historial de mascota (conceptual)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm">
                Esta vista consolida informacion cruzada de mascotas, citas, diagnosticos y tratamientos.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Ultima cita</TableHead>
                    <TableHead>Diagnostico</TableHead>
                    <TableHead>Tratamiento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {HISTORY.map((entry) => (
                    <TableRow key={`${entry.pet}-${entry.lastAppointment}`}>
                      <TableCell>{entry.pet}</TableCell>
                      <TableCell>{entry.owner}</TableCell>
                      <TableCell>{entry.lastAppointment}</TableCell>
                      <TableCell>{entry.diagnosis}</TableCell>
                      <TableCell>{entry.treatment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-sm ring-1 ring-slate-200/80 border border-slate-200/80 dark:ring-slate-700/80 dark:border-slate-800/80">
            <CardHeader>
              <CardTitle>Diagnosticos</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Registrar diagnostico</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo diagnostico</DialogTitle>
                  </DialogHeader>
                  <Form
                    onSubmit={(event) => {
                      handleFormSubmit(event, "Diagnostico guardado", "El diagnostico fue registrado");
                      setDiagnosisPet("");
                    }}
                  >
                    <FormField
                      name="pet"
                      render={({ id }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Mascota</FormLabel>
                          <FormControl>
                            <Combobox
                              id={id}
                              name="pet"
                              options={PET_OPTIONS}
                              value={diagnosisPet}
                              onChange={setDiagnosisPet}
                              placeholder="Buscar mascota"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="summary"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Resumen</FormLabel>
                          <FormControl>
                            <Input id={id} name={name} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="detail"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Detalle</FormLabel>
                          <FormControl>
                            <Textarea id={id} name={name} rows={4} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Guardar diagnostico</Button>
                    </DialogFooter>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Veterinario</TableHead>
                    <TableHead>Resumen</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DIAGNOSTICS.map((diagnostic) => (
                    <TableRow key={diagnostic.id}>
                      <TableCell>{diagnostic.id}</TableCell>
                      <TableCell>{diagnostic.pet}</TableCell>
                      <TableCell>{diagnostic.vet}</TableCell>
                      <TableCell>{diagnostic.summary}</TableCell>
                      <TableCell>
                        <Badge variant={statusToBadge(diagnostic.status)}>{diagnostic.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-sm ring-1 ring-slate-200/80 border border-slate-200/80 dark:ring-slate-700/80 dark:border-slate-800/80">
            <CardHeader>
              <CardTitle>Tratamientos</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Registrar tratamiento</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo tratamiento</DialogTitle>
                  </DialogHeader>
                  <Form
                    onSubmit={(event) => {
                      handleFormSubmit(event, "Tratamiento guardado", "El plan de tratamiento fue registrado");
                      setTreatmentPet("");
                    }}
                  >
                    <FormField
                      name="pet"
                      render={({ id }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Mascota</FormLabel>
                          <FormControl>
                            <Combobox
                              id={id}
                              name="pet"
                              options={PET_OPTIONS}
                              value={treatmentPet}
                              onChange={setTreatmentPet}
                              placeholder="Buscar mascota"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="indication"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Indicaciones</FormLabel>
                          <FormControl>
                            <Textarea id={id} name={name} rows={4} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="status"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Estado</FormLabel>
                          <FormControl>
                            <Select
                              id={id}
                              name={name}
                              defaultValue="activo"
                              options={STATUS_OPTIONS.filter((option) =>
                                ["activo", "pendiente", "inactivo"].includes(option.value),
                              )}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Guardar tratamiento</Button>
                    </DialogFooter>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Indicaciones</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TREATMENTS.map((treatment) => (
                    <TableRow key={treatment.id}>
                      <TableCell>{treatment.id}</TableCell>
                      <TableCell>{treatment.pet}</TableCell>
                      <TableCell>{treatment.indication}</TableCell>
                      <TableCell>
                        <Badge variant={statusToBadge(treatment.status)}>{treatment.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <Card className="shadow-sm ring-1 ring-slate-200/80 border border-slate-200/80 dark:ring-slate-700/80 dark:border-slate-800/80">
            <CardHeader>
              <CardTitle>Usuarios</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Crear usuario</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo usuario</DialogTitle>
                  </DialogHeader>
                  <Form
                    onSubmit={(event) =>
                      handleFormSubmit(event, "Usuario creado", "El usuario fue agregado en el catalogo")
                    }
                  >
                    <FormField
                      name="name"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Nombre</FormLabel>
                          <FormControl>
                            <Input id={id} name={name} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="email"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Correo</FormLabel>
                          <FormControl>
                            <Input id={id} name={name} type="email" required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="role"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Rol</FormLabel>
                          <FormControl>
                            <Select id={id} name={name} options={ROLE_OPTIONS} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Guardar usuario</Button>
                    </DialogFooter>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {USERS.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={statusToBadge(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            onClick={() => pushToast("Usuario en edicion", `Se abrio edicion para ${user.name}`)}
                          >
                            Editar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">Eliminar</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta accion elimina el usuario seleccionado.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel asChild>
                                  <Button variant="outline">Cancelar</Button>
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  asChild
                                  onClick={() =>
                                    pushToast("Usuario eliminado", `${user.name} fue eliminado del catalogo`)
                                  }
                                >
                                  <Button variant="destructive">Confirmar</Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-sm ring-1 ring-slate-200/80 border border-slate-200/80 dark:ring-slate-700/80 dark:border-slate-800/80">
            <CardHeader>
              <CardTitle>Servicios</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Agregar servicio</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo servicio</DialogTitle>
                  </DialogHeader>
                  <Form
                    onSubmit={(event) =>
                      handleFormSubmit(event, "Servicio creado", "El servicio se agrego al catalogo")
                    }
                  >
                    <FormField
                      name="serviceName"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Nombre del servicio</FormLabel>
                          <FormControl>
                            <Input id={id} name={name} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="price"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Precio</FormLabel>
                          <FormControl>
                            <Input id={id} name={name} type="number" min="0" step="0.01" required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="description"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Descripcion</FormLabel>
                          <FormControl>
                            <Textarea id={id} name={name} rows={3} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="status"
                      render={({ id, name }) => (
                        <FormItem>
                          <FormLabel htmlFor={id}>Estado</FormLabel>
                          <FormControl>
                            <Select
                              id={id}
                              name={name}
                              defaultValue="activo"
                              options={STATUS_OPTIONS.filter((option) =>
                                ["activo", "inactivo"].includes(option.value),
                              )}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Guardar servicio</Button>
                    </DialogFooter>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SERVICES.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.id}</TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>${service.price}</TableCell>
                      <TableCell>
                        <Badge variant={statusToBadge(service.status)}>{service.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            onClick={() => pushToast("Servicio en edicion", `Se abrio edicion para ${service.name}`)}
                          >
                            Editar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">Eliminar</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Eliminar servicio</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta accion elimina el servicio del catalogo.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel asChild>
                                  <Button variant="outline">Cancelar</Button>
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  asChild
                                  onClick={() =>
                                    pushToast("Servicio eliminado", `${service.name} fue eliminado`)
                                  }
                                >
                                  <Button variant="destructive">Confirmar</Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ToastViewport items={toasts} onClose={closeToast} />
    </section>
  );
}
