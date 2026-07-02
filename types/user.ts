import type { UserType } from "@/types/enums";

export interface UserItem {
  id_user: number;
  username: string;
  type: UserType;
}

export type UserResponse = UserItem[];

export interface UserApiCamel {
  idUser: number;
  username: string;
  type: UserType;
}

export type RawUser = UserItem | UserApiCamel;

// UserRequest del backend: { username, password, type }
export interface UserRequest {
  username: string;
  password: string;
  type: UserType;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  type: UserType;
}

export type UpdateUserRequest = CreateUserRequest;
