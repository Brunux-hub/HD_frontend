export interface Appointment {
  idCita: number;
  motivo: string;
  notas: string;
  estado: string;
  fechaProgramada: string;
  idUsuarioRecepcionista: number;
  idServicio: number;
  idMascota: number;
  idUsuarioVeterinario: number;
}

export interface AppointmentRequest {
  motivo: string;
  notas: string;
  fechaProgramada: string;
  idUsuarioRecepcionista: number;
  idServicio: number;
  idMascota: number;
  idUsuarioVeterinario: number;
  estado?: string;
}
