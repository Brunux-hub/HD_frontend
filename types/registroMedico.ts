export interface RegistroMedico {
  idRegistroMedico: number;
  idCita: number;
  fecha: string;
  diagnostico: string;
  medicamentosRecetados: string;
  observaciones: string;
}

export interface RegistroMedicoRequest {
  idCita: number;
  diagnostico: string;
  medicamentosRecetados: string;
  observaciones: string;
}