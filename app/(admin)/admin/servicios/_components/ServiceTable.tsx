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

import ServiceFormDialog from "./ServiceFormDialog";

import { Service, ServiceRequest } from "@/types/service";

type ConfirmAction = {
  id: number;
  nombre: string;
  action: "activar" | "desactivar";
};

type Props = {
  services: Service[];
  onEdit?: (id: number, service: ServiceRequest) => void;
  onActivate?: (id: number) => Promise<void>;
  onDeactivate?: (id: number) => Promise<void>;
};

const ServiceTable = ({ services, onEdit, onActivate, onDeactivate }: Props) => {
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);
  const hasActions = Boolean(onEdit || onActivate || onDeactivate);

  const handleConfirm = async () => {
    if (!confirm) return;
    if (confirm.action === "activar" && onActivate) await onActivate(confirm.id);
    else if (confirm.action === "desactivar" && onDeactivate) await onDeactivate(confirm.id);
    setConfirm(null);
  };

  const msgs: Record<ConfirmAction["action"], { title: string; desc: string }> = {
    activar: {
      title: "Reactivar servicio",
      desc: `¿Estás seguro de reactivar "${confirm?.nombre}"?`,
    },
    desactivar: {
      title: "Desactivar servicio",
      desc: `¿Estás seguro de desactivar "${confirm?.nombre}"?`,
    },
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Precio</TableHead>
            {hasActions && <TableHead className="w-25"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.idServicio}>
              <TableCell>
                <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${service.activo ? "bg-green-500" : "bg-red-500"}`} />
                {service.nombre}
              </TableCell>
              <TableCell>{service.descripcion}</TableCell>
              <TableCell>{service.precio}</TableCell>
              {hasActions && (
                <TableCell className="flex justify-between gap-2">
                  {onActivate && onDeactivate && (
                    service.activo ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setConfirm({ id: service.idServicio, nombre: service.nombre, action: "desactivar" })}
                      >
                        Desactivar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirm({ id: service.idServicio, nombre: service.nombre, action: "activar" })}
                      >
                        Reactivar
                      </Button>
                    )
                  )}
                  {onEdit && (
                    <ServiceFormDialog
                      icon={SquarePen}
                      mode="edit"
                      buttonColor="alert"
                      data={service}
                      onSubmit={(payload) => onEdit(service.idServicio, payload)}
                    />
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={hasActions ? 5 : 4} className="h-5 text-center"></TableCell>
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

export default ServiceTable;
