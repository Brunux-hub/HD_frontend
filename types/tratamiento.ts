export interface Tratamiento {
  idTratamiento: number;
  idRegistroMedico: number;
  medicamento: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  indicaciones: string;
}

export interface TratamientoRequest {
  idRegistroMedico: number;
  medicamento: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  indicaciones: string;
}