"use client";

import { CirclePlus } from "lucide-react";

import { useEffect, useState } from "react";

import SectionHeader from "../_components/SectionHeader";
import UserTable from "./_components/UserTable";
import UserFormDialog from "./_components/UserFormDialog";

import { Usuario } from "@/types/usuario";

import {
  getUsuarios,
  createUsuarios,
  updateUsuario,
  deleteUsuario,
} from "@/services/usuarios/storage";

const UsersPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    setUsuarios(getUsuarios());
  }, []);

  const handleCreate = (usuario: Omit<Usuario, "id">) => {
    const updated = createUsuarios(usuario);
    setUsuarios(updated);
  };

  const handleUpdate = (id: number, usuario: Omit<Usuario, "id">) => {
    const updated = updateUsuario(id, usuario);
    setUsuarios(updated);
  };

  const handleDelete = (id: number) => {
    const updated = deleteUsuario(id);
    setUsuarios(updated);
  };

  return (
    <div className="max-w-295 px-4 mx-auto border flex flex-col gap-8 border-amber-500">
      <SectionHeader
        iconName="Icono usuarios"
        iconLabel="usuarios"
        title="Listado de usuarios"
        description="Vista donde podrás revisar y gestionar los usuarios"
        action={
          <UserFormDialog
            mode="create"
            icon={CirclePlus}
            buttonColor="success"
            onSubmit={handleCreate}
          />
        }
      />

      {/* TABLA DE usuarios */}
      <UserTable
        usuarios={usuarios}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UsersPage;
