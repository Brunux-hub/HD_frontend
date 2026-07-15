export interface ItemReceta {
  idItemReceta: number;
  idReceta: number;
  medicamento: string;
  cantidad: string;
  dosis: string;
  indicaciones: string;
}

export interface ItemRecetaRequest {
  idReceta: number;
  medicamento: string;
  cantidad: string;
  dosis: string;
  indicaciones: string;
}