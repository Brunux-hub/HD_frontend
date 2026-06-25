"use client";

import { useState, useEffect } from "react";
import { Loader2, FlaskConical } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import SectionHeader from "../../../_components/SectionHeader";

import { vaccineApi } from "@/api/endpoints";
import type { Vaccine } from "@/types/api";

export default function VaccinesCatalogPage() {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vaccineApi
      .getAll()
      .then((res) => setVaccines(res.data as Vaccine[]))
      .catch(() => toast.error("Error al cargar el catálogo de vacunas"))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      key: "name",
      header: "Nombre",
      render: (item: Vaccine) => (
        <span className="font-medium">{item.name}</span>
      ),
    },
    {
      key: "description",
      header: "Descripción",
      render: (item: Vaccine) => (
        <span className="max-w-[300px] truncate block" title={item.description}>
          {item.description || "-"}
        </span>
      ),
    },
    {
      key: "manufacturer",
      header: "Fabricante",
      render: (item: Vaccine) => item.manufacturer || "-",
    },
    {
      key: "required_dose",
      header: "Dosis Requeridas",
      render: (item: Vaccine) => (
        <span className="tabular-nums">{item.required_dose}</span>
      ),
    },
  ];

  const tableData = vaccines.map((v) => ({ ...v, id: v.id_vaccine })) as any;

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Servicios"
        iconLabel="Catálogo"
        title="Catálogo de Vacunas"
        description="Listado completo de vacunas disponibles en el sistema"
      />

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable
              columns={columns as any}
              data={tableData}
              searchable
              searchKeys={["name", "description", "manufacturer"] as any}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
