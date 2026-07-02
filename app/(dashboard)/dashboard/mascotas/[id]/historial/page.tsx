"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CirclePlus, ArrowLeft } from "lucide-react";

import SectionHeader from "../../../_components/SectionHeader";
import MedicalHistoryTable from "./_components/MedicalHistoryTable";
import MedicalHistoryFormDialog from "../../_components/MedicalHistoryFormDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { findMedicalHistoryByPet, createMedicalHistory } from "@/services/medicalHistory/medicalHistoryService";
import { findAllServices } from "@/services/servicios/serviceService";
import { findAllAppointments } from "@/services/citas/appointmentService";
import type { MedicalHistoryItem, CreateMedicalHistoryRequest } from "@/types/medicalHistory";
import type { ServiceItem } from "@/types/servicio";
import type { AppointmentItem } from "@/types/cita";

const MedicalHistoryPage = () => {
  const params = useParams<{ id: string }>();
  const petId = Number(params?.id);

  const [records, setRecords] = useState<MedicalHistoryItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!Number.isFinite(petId)) {
      setError("ID de mascota inválido.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [recordsData, servicesData, appointmentsData] = await Promise.all([
        findMedicalHistoryByPet(petId),
        findAllServices(),
        findAllAppointments(),
      ]);
      setRecords(recordsData);
      setServices(servicesData);
      setAppointments(appointmentsData.filter((a) => a.pet.idPet === petId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cargar el historial clínico.",
      );
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleCreate = async (data: CreateMedicalHistoryRequest) => {
    const created = await createMedicalHistory(data);
    setRecords((current) => [...current, created]);
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-295 flex-col gap-6 px-4">
        <p className="text-sm text-muted-foreground">Cargando historial clínico...</p>
      </div>
    );
  }

  if (!Number.isFinite(petId)) {
    return (
      <div className="mx-auto flex max-w-295 flex-col gap-6 px-4">
        <SectionHeader
          iconName="Icono Historial"
          iconLabel="Historial Clínico"
          title="Mascota no encontrada"
          description="El ID de mascota proporcionado no es válido."
          action={
            <Button asChild variant="outline">
              <Link href="/dashboard/mascotas">Volver al listado</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Historial"
        iconLabel="Historial Clínico"
        title="Historial Clínico"
        description="Registros médicos de la mascota."
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/mascotas">
                <ArrowLeft />
                Volver a mascotas
              </Link>
            </Button>
            <MedicalHistoryFormDialog
              services={services}
              appointments={appointments}
              icon={CirclePlus}
              buttonColor="success"
              onSubmit={handleCreate}
            />
          </div>
        }
      />

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <Card>
          <CardContent className="pt-2">
            <MedicalHistoryTable records={records} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicalHistoryPage;
