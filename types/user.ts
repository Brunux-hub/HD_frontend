export interface User {
  idUsuario: number;
  correo: string;
  rol: string;
  habilitado: boolean;
}

export interface UserRequest {
  correo: string;
  contrasenia: string;
  rol: string;
}
