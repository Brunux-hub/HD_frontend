import type { UserType } from "@/types/enums";

// UserResponse del backend: { id_user, username, type }
export interface User {
  id_user: number;
  username: string;
  type: UserType;
}

// UserRequest del backend: { username, password, type }
export interface UserRequest {
  username: string;
  password: string;
  type: UserType;
}
