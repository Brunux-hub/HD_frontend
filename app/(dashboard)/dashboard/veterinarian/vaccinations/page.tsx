"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Plus, Loader2, Search, X, Syringe } from "lucide-react";
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

import { vaccinationApi, petApi, vaccineApi } from "@/api/endpoints";
import type { Vaccination, Pet, Vaccine } from "@/types/api";

export default function VaccinationsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [records, setRecords] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [petSearch, setPetSearch] = useState("");
  const [petPopoverOpen, setPetPopoverOpen] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [newVaccineId, setNewVaccineId] = useState("");
  const [newAppDate, setNewAppDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [newNextDate, setNewNextDate] = useState("");
  const [newObservation, setNewObservation] = useState("");

  useEffect(() => {
    Promise.all([
      petApi.getAll(),
      vaccineApi.getAll(),
      vaccinationApi.getAll(),
    ])
      .then(([petRes, vacRes, vacRecRes]) => {
        setPets(petRes.data as Pet[]);
        setVaccines(vacRes.data as Vaccine[]);
        setRecords(vacRecRes.data as Vaccination[]);
      })
      .catch(() => toast.error("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, []);

  const filteredPets = pets.filter((p) =>
    p.name.toLowerCase().includes(petSearch.toLowerCase())
  );

  const petVaccinations = selectedPet
    ? records.filter(
        (r) => r.medical_history?.appointment?.pet?.id_pet === selectedPet.id_pet
      )
    : [];

  const handleCreate = () => {
    if (!selectedPet || !newVaccineId || !newAppDate) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    setFormLoading(true);
    vaccinationApi
      .create({
        vaccine: { id_vaccine: Number(newVaccineId) } as Vaccine,
        application_date: newAppDate,
        next_application_date: newNextDate || undefined,
        observation: newObservation,
      } as any)
      .then((res) => {
        const created = res.data as Vaccination;
        setRecords((prev) => [...prev, created]);
        toast.success("Vacunación registrada exitosamente");
        setFormOpen(false);
        resetForm();
      })
      .catch(() => toast.error("Error al registrar vacunación"))
      .finally(() => setFormLoading(false));
  };

  const resetForm = () => {
    setNewVaccineId("");
    setNewAppDate(format(new Date(), "yyyy-MM-dd"));
    setNewNextDate("");
    setNewObservation("");
  };

  const columns = [
    {
      key: "vaccine",
      header: "Vacuna",
      render: (item: Vaccination) => item.vaccine?.name ?? "-",
    },
    {
      key: "application_date",
      header: "Fecha Aplicación",
      render: (item: Vaccination) =>
        item.application_date
          ? format(new Date(item.application_date), "dd/MM/yyyy")
          : "-",
    },
    {
      key: "next_application_date",
      header: "Próxima Aplicación",
      render: (item: Vaccination) =>
        item.next_application_date
          ? format(new Date(item.next_application_date), "dd/MM/yyyy")
          : "-",
    },
    {
      key: "observation",
      header: "Observación",
      render: (item: Vaccination) => (
        <span
          className="max-w-[250px] truncate block"
          title={item.observation ?? ""}
        >
          {item.observation || "-"}
        </span>
      ),
    },
  ];

  const tableData = petVaccinations.map((r) => ({
    ...r,
    id: r.id_vaccination,
  })) as any;

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Mascotas"
        iconLabel="Vacunaciones"
        title="Control de Vacunación"
        description="Registra y consulta el plan de vacunación de las mascotas"
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
            <CardTitle className="text-lg">Vacunas Aplicadas</CardTitle>
            <Button onClick={() => { resetForm(); setFormOpen(true); }}>
              <Syringe className="h-4 w-4 mr-2" />
              Registrar Vacunación
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
            Selecciona una mascota para ver su plan de vacunación
          </CardContent>
        </Card>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Vacunación</DialogTitle>
            <DialogDescription>
              Ingresa los datos de la vacunación aplicada
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Mascota</Label>
              <Input value={selectedPet?.name ?? ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vaccine">Vacuna *</Label>
              <Select value={newVaccineId} onValueChange={setNewVaccineId}>
                <SelectTrigger id="vaccine">
                  <SelectValue placeholder="Seleccionar vacuna" />
                </SelectTrigger>
                <SelectContent>
                  {vaccines.map((v) => (
                    <SelectItem key={v.id_vaccine} value={String(v.id_vaccine)}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="appDate">Fecha de Aplicación *</Label>
              <Input
                id="appDate"
                type="date"
                value={newAppDate}
                onChange={(e) => setNewAppDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nextDate">Próxima Aplicación</Label>
              <Input
                id="nextDate"
                type="date"
                value={newNextDate}
                onChange={(e) => setNewNextDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="observation">Observación</Label>
              <Textarea
                id="observation"
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
                placeholder="Notas adicionales sobre la vacunación..."
                rows={3}
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
