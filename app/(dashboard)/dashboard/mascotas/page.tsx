"use client";

import { useEffect, useState } from "react";

import SectionHeader from "../_components/SectionHeader";
import PetTable from "./_components/PetTable";

import { Cliente } from "@/types/cliente";
import { Mascota } from "@/types/mascota";
import { getClientes } from "@/services/clientes/storage";
import { getMascotas } from "@/services/mascotas/storage";

const PetsPage = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [ownersById, setOwnersById] = useState<Record<number, Cliente>>({});

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const loadedMascotas = getMascotas();
      const loadedClientes = getClientes();
      const ownerMap = loadedClientes.reduce<Record<number, Cliente>>(
        (acc, cliente) => {
          acc[cliente.id] = cliente;
          return acc;
        },
        {},
      );

      setMascotas(loadedMascotas);
      setOwnersById(ownerMap);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 px-4">
      <SectionHeader
        iconName="Icono Mascotas"
        iconLabel="Mascotas"
        title="Listado general de mascotas"
        description="Vista general de pacientes con su dueño principal y telefono de contacto."
      />

      <PetTable
        mascotas={mascotas}
        ownersById={ownersById}
        showOwner
        caption="Mascotas registradas en la veterinaria"
      />
    </div>
  );
};

export default PetsPage;
