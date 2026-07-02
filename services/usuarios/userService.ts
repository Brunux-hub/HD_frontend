import {
  httpDeleteUserAPI,
  httpGetUserByIdAPI,
  httpGetUsersAPI,
  httpPostUserAPI,
  httpPutUserAPI,
} from "@/api/userHttp";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserItem,
  UserResponse,
} from "@/types/user";


export async function findAllUsers(): Promise<UserResponse> {
  const response = await httpGetUsersAPI();
  return response ?? [];
}

export async function findUserById(id: number): Promise<UserItem> {
  const response = await httpGetUserByIdAPI(id);
  return response;
}

export async function createUser(payload: CreateUserRequest): Promise<UserItem> {
  const response = await httpPostUserAPI(payload);
  return response;
}

export async function updateUser(
  id: number,
  payload: UpdateUserRequest,
): Promise<UserItem> {
  const response = await httpPutUserAPI(id, payload);
  return response;
}

export async function deleteUser(id: number): Promise<void> {
  await httpDeleteUserAPI(id);
}
