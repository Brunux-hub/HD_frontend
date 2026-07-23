export interface RegistroMedico {
  idRegistroMedico: number;
  idCita: number;
  fecha: string;
  diagnostico: string;
  peso: number;
  observaciones: string;
  mascota?: {
    idMascota: number;
    nombre: string;
  };
}

export interface RegistroMedicoRequest {
  idCita: number;
  diagnostico: string;
  peso: number;
  observaciones: string;
}
