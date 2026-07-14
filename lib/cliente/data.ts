import { getMyOwner } from "@/services/owners/owners";
import { getPetsByOwner } from "@/services/pets/pets";
import type { ClienteResponse } from "@/types/cliente";

export type Mascota = {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  nacimiento: string;
};

/** Edad en años a partir de la fecha de nacimiento (ISO). */
export const edadEnAnios = (iso: string): number => {
  if (!iso) return 0;
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const now = new Date();
  let edad = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) edad--;
  return Math.max(edad, 0);
};

/** Trae el cliente logueado + sus mascotas. */
export async function getClientData(): Promise<{ owner: ClienteResponse | null; mascotas: Mascota[] }> {
  const owner = await getMyOwner();
  if (!owner) return { owner: null, mascotas: [] };

  const [pets] = await Promise.all([
    getPetsByOwner(owner.idUsuario),
  ]);

  const mascotas: Mascota[] = pets.map((p) => ({
    id: p.idMascota,
    nombre: p.nombre,
    especie: p.especie,
    raza: p.raza,
    sexo: p.sexo,
    nacimiento: (p.fechaNacimiento ?? "").slice(0, 10),
  }));

  return { owner, mascotas };
}
