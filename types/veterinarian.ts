export interface Veterinarian {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  numeroLicencia: string;
  especialidades: string[];
  usuario: {
    idUsuario: number;
    correo: string;
    rol: string;
    habilitado: boolean;
  };
}

export interface VeterinarianRequest {
  correo: string;
  contrasenia: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  numeroLicencia: string;
  especialidades: string[];
  habilitado: boolean;
}
