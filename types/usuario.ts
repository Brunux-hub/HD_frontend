export interface Usuario {
  id: number;
  nombre: string;
  apellidos:string;
  email: string;
  password:string;
  rol: "Admin" | "Veterinario" | "Recepcionista";
  especialidad: string;
  estado: boolean;
}
