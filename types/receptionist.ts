export interface Receptionist {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  usuario: {
    idUsuario: number;
    correo: string;
    rol: string;
    habilitado: boolean;
  };
}

export interface ReceptionistRequest {
  correo: string;
  contrasenia: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  habilitado: boolean;
}
