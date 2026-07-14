export interface Service {
  idServicio: number;
  nombre: string;
  descripcion: string;
  precio: number;
  activo: boolean;
}

export interface ServiceRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  activo: boolean;
}
