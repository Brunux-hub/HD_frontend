export interface Pet {
  idMascota: number;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fechaNacimiento: string;
  activo: boolean;
  idUsuarioCliente: number;
}

export interface PetRequest {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fechaNacimiento: string;
  idUsuarioCliente: number;
  activo: boolean;
}
