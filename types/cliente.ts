export interface ClienteResponse {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  direccion: string;
  usuario: {
    idUsuario: number;
    correo: string;
    rol: string;
    habilitado: boolean;
  };
}

export interface ClienteRequest {
  correo: string;
  contrasenia: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  direccion: string;
  habilitado?: boolean;
}
