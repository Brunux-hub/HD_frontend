export interface Servicio {
  id: number;
  nombre: string;
  categoria: "consulta" | "cirugia" | "grooming";
  descripcion: string;
  precio: number;
  estado: boolean;
}

export interface ServicioFormData {
  nombre: string;
  categoria:string;
  descripcion: string;
  precio: number;
  estado: boolean;
}
