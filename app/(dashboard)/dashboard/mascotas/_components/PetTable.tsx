"use client";

import { useState } from "react";
import { SquarePen } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import PetFormDialog from "./PetFormDialog";

import { Pet, PetRequest } from "@/types/pet";
import { ClienteResponse } from "@/types/cliente";

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

const PetTable = ({
  pets,
  showOwner = false,
  owners,
  onEdit,
  onActivate,
  onDeactivate,
}: Props) => {
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);
  const hasActions = Boolean(onEdit || onActivate || onDeactivate);
  const ownerMap = new Map(owners?.map((o) => [o.idUsuario, o]));

  const handleConfirm = async () => {
    if (!confirm) return;
    if (confirm.action === "activar" && onActivate) await onActivate(confirm.id);
    else if (confirm.action === "desactivar" && onDeactivate) await onDeactivate(confirm.id);
    setConfirm(null);
  };

  const msgs: Record<ConfirmAction["action"], { title: string; desc: string }> = {
    activar: {
      title: "Reactivar mascota",
      desc: `¿Estás seguro de reactivar a "${confirm?.nombre}"?`,
    },
    desactivar: {
      title: "Desactivar mascota",
      desc: `¿Estás seguro de desactivar a "${confirm?.nombre}"?`,
    },
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Especie</TableHead>
            <TableHead>Raza</TableHead>
            <TableHead>Sexo</TableHead>
            <TableHead>Nacimiento</TableHead>
            {showOwner && <TableHead>Dueño</TableHead>}
            {hasActions && <TableHead className="w-32"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pets.map((pet) => (
            <TableRow key={pet.idMascota}>
              <TableCell>
                <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${pet.activo ? "bg-green-500" : "bg-red-500"}`} />
                {pet.nombre}
              </TableCell>
              <TableCell>{pet.especie}</TableCell>
              <TableCell>{pet.raza}</TableCell>
              <TableCell>{sexoLabel(pet.sexo)}</TableCell>
              <TableCell>{fmtDate(pet.fechaNacimiento)}</TableCell>
              {showOwner && (
                <TableCell>
                  {(() => {
                    const o = ownerMap.get(pet.idUsuarioCliente);
                    return o ? `${o.nombres} ${o.apellidos}` : `ID ${pet.idUsuarioCliente}`;
                  })()}
                </TableCell>
              )}
              {hasActions && (
                <TableCell className="flex gap-2">
                  {onActivate && onDeactivate && (
                    pet.activo ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setConfirm({ id: pet.idMascota, nombre: pet.nombre, action: "desactivar" })}
                      >
                        Desactivar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirm({ id: pet.idMascota, nombre: pet.nombre, action: "activar" })}
                      >
                        Reactivar
                      </Button>
                    )
                  )}
                  {onEdit && (
                    <PetFormDialog
                      ownerId={pet.idUsuarioCliente}
                      icon={SquarePen}
                      mode="edit"
                      buttonColor="alert"
                      data={pet}
                      onSubmit={(payload) => onEdit(pet.idMascota, payload)}
                    />
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={showOwner ? (hasActions ? 8 : 7) : hasActions ? 7 : 6}
              className="h-5 text-center"
            ></TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Dialog open={!!confirm} onOpenChange={(v) => { if (!v) setConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="sr-only" />
          <DialogDescription className="sr-only" />
          <div className="py-4 text-center">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {confirm && msgs[confirm.action]?.title}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {confirm && msgs[confirm.action]?.desc}
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant={confirm?.action === "activar" ? "default" : "destructive"}
              onClick={handleConfirm}
            >
              {confirm?.action === "activar" ? "Sí, reactivar" : "Sí, desactivar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PetTable;
