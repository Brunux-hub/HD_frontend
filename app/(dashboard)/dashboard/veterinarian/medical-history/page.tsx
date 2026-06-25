"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Plus, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DataTable } from "@/components/DataTable";
import SectionHeader from "../../_components/SectionHeader";

import { medicalHistoryApi, petApi, serviceApi } from "@/api/endpoints";
import type { MedicalHistory, Pet, Services } from "@/types/api";
import { useAuthStore } from "@/store/auth-store";

export default function MedicalHistoryPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Services[]>([]);
  const [records, setRecords] = useState<MedicalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [petSearch, setPetSearch] = useState("");
  const [petPopoverOpen, setPetPopoverOpen] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [newServiceId, setNewServiceId] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    Promise.all([
      petApi.getAll(),
      serviceApi.getAll(),
      medicalHistoryApi.getAll(),
    ])
      .then(([petRes, svcRes, mhRes]) => {
        setPets(petRes.data as Pet[]);
        setServices(svcRes.data as Services[]);
        setRecords(mhRes.data as MedicalHistory[]);
      })
      .catch(() => toast.error("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, []);

  const filteredPets = pets.filter((p) =>
    p.name.toLowerCase().includes(petSearch.toLowerCase())
  );

  const petRecords = selectedPet
    ? records.filter((r) => r.appointment?.pet?.id_pet === selectedPet.id_pet)
    : [];

  const handleCreate = () => {
    if (!selectedPet || !newServiceId || !newDescription || !newDate) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    setFormLoading(true);
    medicalHistoryApi
      .create({
        services: { id_service: Number(newServiceId) } as Services,
        description: newDescription,
        date: newDate,
      } as any)
      .then((res) => {
        const created = res.data as MedicalHistory;
        setRecords((prev) => [...prev, created]);
        toast.success("Registro médico creado exitosamente");
        setFormOpen(false);
        resetForm();
      })
      .catch(() => toast.error("Error al crear registro médico"))
      .finally(() => setFormLoading(false));
  };

  const resetForm = () => {
    setNewServiceId("");
    setNewDescription("");
    setNewDate(format(new Date(), "yyyy-MM-dd"));
  };

  const columns = [
    {
      key: "date",
      header: "Fecha",
      render: (item: MedicalHistory) => format(new Date(item.date), "dd/MM/yyyy"),
    },
    {
      key: "service",
      header: "Servicio",
      render: (item: MedicalHistory) => item.services?.name ?? "-",
    },
    {
      key: "description",
      header: "Descripción",
      render: (item: MedicalHistory) => (
        <span className="max-w-[250px] truncate block" title={item.description}>
          {item.description}
        </span>
      ),
    },
    {
      key: "appointment_date",
      header: "Fecha de Cita",
      render: (item: MedicalHistory) =>
        item.appointment
          ? format(new Date(item.appointment.date), "dd/MM/yyyy")
          : "-",
    },
  ];

  const tableData = petRecords.map((r) => ({ ...r, id: r.id_medical_history })) as any;

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Mascotas"
        iconLabel="Historial Médico"
        title="Historial Médico"
        description="Consulta y gestiona el historial médico de las mascotas"
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Seleccionar Mascota</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover open={petPopoverOpen} onOpenChange={setPetPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full max-w-md justify-between">
                {selectedPet ? selectedPet.name : "Buscar mascota..."}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
              <div className="space-y-2">
                <Input
                  placeholder="Buscar por nombre..."
                  value={petSearch}
                  onChange={(e) => setPetSearch(e.target.value)}
                  autoFocus
                />
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredPets.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No se encontraron mascotas
                    </p>
                  ) : (
                    filteredPets.map((pet) => (
                      <button
                        key={pet.id_pet}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          selectedPet?.id_pet === pet.id_pet
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => {
                          setSelectedPet(pet);
                          setPetPopoverOpen(false);
                          setPetSearch("");
                        }}
                      >
                        <span className="font-medium">{pet.name}</span>
                        <span className="ml-2 text-muted-foreground text-xs">
                          {pet.species} - {pet.owner.names} {pet.owner.last_names}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {selectedPet && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="rounded-sm">
                {selectedPet.name}
              </Badge>
              <span>{selectedPet.species} - {selectedPet.race}</span>
              <Button variant="ghost" size="xs" className="h-6 w-6 p-0 ml-auto" onClick={() => setSelectedPet(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPet && (
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-lg">Registros Médicos</CardTitle>
            <Button onClick={() => { resetForm(); setFormOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Registro
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <DataTable
                columns={columns as any}
                data={tableData}
                searchable={false}
              />
            )}
          </CardContent>
        </Card>
      )}

      {!selectedPet && !loading && (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Selecciona una mascota para ver su historial médico
          </CardContent>
        </Card>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Registro Médico</DialogTitle>
            <DialogDescription>
              Ingresa los datos del nuevo registro médico
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Mascota</Label>
              <Input value={selectedPet?.name ?? ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="service">Servicio *</Label>
              <Select value={newServiceId} onValueChange={setNewServiceId}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id_service} value={String(s.id_service)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe el procedimiento o diagnóstico..."
                rows={4}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={formLoading}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={formLoading}>
              {formLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
