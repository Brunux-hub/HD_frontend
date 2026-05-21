"use client";

import { useState } from "react";
import { CirclePlus } from "lucide-react";

import SectionHeader from "../_components/SectionHeader";
import ClientFormDialog from "./_components/ClientFormDialog";
import ClientTable from "./_components/ClientTable";

import { Cliente } from "@/types/cliente";
import {
  createCliente,
  deleteCliente,
  getClientes,
  updateCliente,
} from "@/services/clientes/storage";

const ClientsPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>(() =>
    typeof window === "undefined" ? [] : getClientes(),
  );

  const handleCreate = (cliente: Omit<Cliente, "id">) => {
    const updated = createCliente(cliente);
    setClientes(updated);
  };

  const handleUpdate = (id: number, cliente: Omit<Cliente, "id">) => {
    const updated = updateCliente(id, cliente);
    setClientes(updated);
  };

  const handleDelete = (id: number) => {
    const updated = deleteCliente(id);
    setClientes(updated);
  };

  return (
    <div className="mx-auto flex max-w-295 flex-col gap-8 border border-amber-500 px-4">
      <SectionHeader
        iconName="Icono Clientes"
        iconLabel="Clientes"
        title="Listado de clientes"
        description="Vista donde podras revisar y gestionar los clientes"
        action={
          <ClientFormDialog
            mode="create"
            icon={CirclePlus}
            buttonColor="success"
            onSubmit={handleCreate}
          />
        }
      />

      <ClientTable
        clientes={clientes}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ClientsPage;
