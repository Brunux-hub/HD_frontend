import { getMyOwner } from "@/services/owners/owners";
import { getPetsByOwner } from "@/services/pets/pets";
import type { Owner } from "@/types/owner";

export type Mascota = {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  sexo: "MALE" | "FEMALE";
  nacimiento: string;
  peso: string;
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
export async function getClientData(): Promise<{ owner: Owner | null; mascotas: Mascota[] }> {
  const owner = await getMyOwner();
  if (!owner) return { owner: null, mascotas: [] };

  const [pets] = await Promise.all([
    getPetsByOwner(owner.id_owner),
  ]);

  const mascotas: Mascota[] = pets.map((p) => ({
    id: p.id_pet,
    nombre: p.name,
    especie: p.species,
    raza: p.race,
    sexo: p.pet_gender,
    nacimiento: (p.birthdate ?? "").slice(0, 10),
    peso: p.weight,
  }));

  return { owner, mascotas };
}
