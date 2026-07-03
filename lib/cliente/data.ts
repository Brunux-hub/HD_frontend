/**
 * Datos reales del portal del cliente (owner logueado).
 *   - GET /owner/me         -> el cliente
 *   - GET /pet (filtrado)   -> sus mascotas
 *   - GET /vaccination      -> vacunas (se enlazan a la mascota vía
 *                              vaccination.medical_history.appointment.pet)
 */
import { getMyOwner } from "@/services/owners/owners";
import { getPetsByOwner } from "@/services/pets/pets";
import { getVaccinations } from "@/services/vaccinations/vaccinations";
import type { Owner } from "@/types/owner";

export type Vacuna = {
  id: number;
  nombre: string;
  fabricante: string;
  fechaAplicacion: string;
  proximaDosis: string | null;
  estado: "Aplicada" | "Próxima" | "Vencida";
  veterinario: string;
};

export type Mascota = {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  sexo: "MALE" | "FEMALE";
  nacimiento: string;
  peso: string;
  vacunas: Vacuna[];
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

const estadoVacuna = (next: string | null): Vacuna["estado"] => {
  if (!next) return "Aplicada";
  const nextMs = new Date(next.slice(0, 10) + "T00:00:00").getTime();
  const now = Date.now();
  const en30 = now + 30 * 24 * 60 * 60 * 1000;
  if (nextMs < now) return "Vencida";
  if (nextMs <= en30) return "Próxima";
  return "Aplicada";
};

/** Trae el cliente logueado + sus mascotas (con sus vacunas). */
export async function getClientData(): Promise<{ owner: Owner | null; mascotas: Mascota[] }> {
  const owner = await getMyOwner();
  if (!owner) return { owner: null, mascotas: [] };

  const [pets, vaccinations] = await Promise.all([
    getPetsByOwner(owner.id_owner),
    getVaccinations().catch(() => []),
  ]);

  const mascotas: Mascota[] = pets.map((p) => ({
    id: p.id_pet,
    nombre: p.name,
    especie: p.species,
    raza: p.race,
    sexo: p.pet_gender,
    nacimiento: (p.birthdate ?? "").slice(0, 10),
    peso: p.weight,
    vacunas: vaccinations
      .filter((v) => v.medical_history?.appointment?.pet?.id_pet === p.id_pet)
      .map((v) => ({
        id: v.id_vaccination,
        nombre: v.vaccine?.name ?? "Vacuna",
        fabricante: v.vaccine?.manufacturer ?? "",
        fechaAplicacion: (v.application_date ?? "").slice(0, 10),
        proximaDosis: v.next_application_date ? v.next_application_date.slice(0, 10) : null,
        estado: estadoVacuna(v.next_application_date ?? null),
        veterinario: v.medical_history?.appointment?.veterinarian
          ? `${v.medical_history.appointment.veterinarian.names} ${v.medical_history.appointment.veterinarian.last_names}`
          : "—",
      })),
  }));

  return { owner, mascotas };
}
