/**
 * Fuente de datos del portal del cliente.
 *
 * Por ahora está VACÍA (el cliente aún no tiene mascotas). Las mascotas se
 * crearán desde el flujo del staff (p. ej. al generar una cita) y este apartado
 * se poblará solo cuando integremos el backend:
 *   - GET /pet            -> mascotas del cliente logueado
 *   - GET /vaccination    -> vacunas por mascota
 */

export type Vacuna = {
  id: number;
  nombre: string;
  fabricante: string;
  fechaAplicacion: string; // ISO yyyy-mm-dd
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
  nacimiento: string; // ISO
  peso: string;
  foto: string;
  vacunas: Vacuna[];
};

// TODO(backend): reemplazar por GET /pet del cliente logueado.
export const getMascotas = (): Mascota[] => [];

export const getMascotaById = (id: number): Mascota | undefined =>
  getMascotas().find((m) => m.id === id);

/** Edad en años a partir de la fecha de nacimiento (ISO). */
export const edadEnAnios = (iso: string): number => {
  const [y, m, d] = iso.split("-").map(Number);
  const ref = { y: 2026, m: 7, d: 1 }; // referencia fija (evita depender del reloj)
  let edad = ref.y - y;
  if (ref.m < m || (ref.m === m && ref.d < d)) edad--;
  return Math.max(edad, 0);
};
