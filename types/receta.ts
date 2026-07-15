export interface Receta {
  idReceta: number;
  idRegistroMedico: number;
  numeroReceta: string;
  fechaEmision: string;
}

export interface RecetaRequest {
  idRegistroMedico: number;
  numeroReceta: string;
}