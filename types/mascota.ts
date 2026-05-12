export interface Mascota {
  id: number;
  nombre: string;
  especie:string;
  raza: string;
  edad:number;
  sexo: "macho" | "hembra";
  fechaNacimiento:string;
  clienteId: number;
}