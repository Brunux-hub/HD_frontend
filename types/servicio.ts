export interface Servicio {
  id: number;
  nombre: string;
  categoria: "consulta" | "cirugia" | "grooming";
  descripcion: string;
  precio: number;
  estado: boolean;
}
