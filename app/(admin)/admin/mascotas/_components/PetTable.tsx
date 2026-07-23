"use client";

import React, { useMemo, useState } from "react";
import { SquarePen } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import PetFormDialog from "./PetFormDialog";

import { Pet, PetRequest } from "@/types/pet";
import { ClienteResponse } from "@/types/cliente";
import { AnimatedFrame } from "@/components/ui/animated-frame";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { ContextMenu } from "@/components/ui/context-menu";

const sexoLabel = (g: string) => (g === "HEMBRA" ? "Hembra" : "Macho");
const fmtDate = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

type ConfirmAction = {
  id: number;
  nombre: string;
  action: "activar" | "desactivar";
};

type Props = {
  pets: Pet[];
  showOwner?: boolean;
  owners?: ClienteResponse[];
  onEdit?: (id: number, pet: PetRequest) => void;
  onActivate?: (id: number) => Promise<void>;
  onDeactivate?: (id: number) => Promise<void>;
};

const PAGE_SIZE = 10;

const PetTable = ({
  pets,
  showOwner = false,
  owners,
  onEdit,
  onActivate,
  onDeactivate,
}: Props) => {
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const hasActions = Boolean(onEdit || onActivate || onDeactivate);
  const ownerMap = useMemo(() => new Map(owners?.map((o) => [o.idUsuario, o])), [owners]);

  const filtered = useMemo(() => {
    if (!search.trim()) return pets;
    const q = search.toLowerCase();
    return pets.filter((p) => p.nombre.toLowerCase().includes(q) || p.especie.toLowerCase().includes(q) || p.raza.toLowerCase().includes(q));
  }, [pets, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE), [filtered, safePage]);

  const handleConfirm = async () => {
    if (!confirm) return;
    if (confirm.action === "activar" && onActivate) await onActivate(confirm.id);
    else if (confirm.action === "desactivar" && onDeactivate) await onDeactivate(confirm.id);
    setConfirm(null);
  };

  const msgs: Record<string, { title: string; desc: string }> = {
    activar: { title: "Reactivar mascota", desc: `¿Reactivar a "${confirm?.nombre}"?` },
    desactivar: { title: "Desactivar mascota", desc: `¿Desactivar a "${confirm?.nombre}"?` },
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar searchValue={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar por nombre, especie o raza..." />

      <AnimatedFrame radius={16}>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Especie</TableHead>
              <TableHead>Raza</TableHead>
              <TableHead>Sexo</TableHead>
              <TableHead>Nacimiento</TableHead>
              {showOwner && <TableHead>Dueño</TableHead>}
              <TableHead>Estado</TableHead>
              {hasActions && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((pet) => (
              <TableRow key={pet.idMascota} className="group">
                <TableCell className="font-medium">{pet.nombre}</TableCell>
                <TableCell>{pet.especie}</TableCell>
                <TableCell className="text-muted-foreground">{pet.raza}</TableCell>
                <TableCell>{sexoLabel(pet.sexo)}</TableCell>
                <TableCell className="text-muted-foreground">{fmtDate(pet.fechaNacimiento)}</TableCell>
                {showOwner && (
                  <TableCell className="text-muted-foreground text-xs">
                    {(() => {
                      const o = ownerMap.get(pet.idUsuarioCliente);
                      return o ? `${o.nombres} ${o.apellidos}` : `#${pet.idUsuarioCliente}`;
                    })()}
                  </TableCell>
                )}
                <TableCell>
                  <Badge variant={pet.activo ? "activo" : "inactivo"}>
                    {pet.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                {hasActions && (
                  <TableCell>
                    <ContextMenu
                      actions={[
                        ...(onEdit
                          ? [{
                              label: "Editar",
                              icon: <SquarePen className="h-3.5 w-3.5" />,
                              onClick: () => setEditingPet(pet),
                            }]
                          : []),
                        ...(pet.activo
                          ? [{ label: "Desactivar", variant: "destructive" as const, onClick: () => setConfirm({ id: pet.idMascota, nombre: pet.nombre, action: "desactivar" }) }]
                          : [{ label: "Reactivar", onClick: () => setConfirm({ id: pet.idMascota, nombre: pet.nombre, action: "activar" }) }]
                        ),
                      ]}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={showOwner ? 8 : 7} className="h-32 text-center text-sm text-muted-foreground">
                  {search ? "No se encontraron resultados." : "No hay mascotas registradas."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </AnimatedFrame>

      <DataTablePagination currentPage={safePage} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      {onEdit && editingPet && (
        <PetFormDialog
          open={!!editingPet}
          onOpenChange={(open) => {
            if (!open) setEditingPet(null);
          }}
          ownerId={editingPet.idUsuarioCliente}
          icon={SquarePen}
          mode="edit"
          buttonColor="alert"
          data={editingPet}
          onSubmit={(payload) => onEdit(editingPet.idMascota, payload)}
        />
      )}

      <Dialog open={!!confirm} onOpenChange={(v) => { if (!v) setConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="sr-only" />
          <DialogDescription className="sr-only" />
          <div className="py-4 text-center">
            <p className="text-base font-semibold">{confirm && msgs[confirm.action]?.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{confirm && msgs[confirm.action]?.desc}</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setConfirm(null)}>Cancelar</Button>
            <Button variant={confirm?.action === "activar" ? "default" : "destructive"} onClick={handleConfirm}>
              {confirm?.action === "activar" ? "Sí, reactivar" : "Sí, desactivar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(PetTable);
