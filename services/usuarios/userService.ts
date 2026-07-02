import {
  httpDeleteUserAPI,
  httpGetUserByIdAPI,
  httpGetUsersAPI,
  httpPostUserAPI,
  httpPutUserAPI,
} from "@/api/userHttp";
import type {
  CreateUserRequest,
  RawUser,
  UpdateUserRequest,
  UserItem,
  UserResponse,
} from "@/types/user";

function normalizeUser(user: RawUser): UserItem {
  if ("idUser" in user) {
    return {
      id_user: user.idUser,
      username: user.username,
      type: user.type,
    };
  }

  return user;
}

export async function findAllUsers(): Promise<UserResponse> {
  const response = await httpGetUsersAPI();
  return (response ?? []).map(normalizeUser);
}

export async function findUserById(id: number): Promise<UserItem> {
  const response = await httpGetUserByIdAPI(id);
  return normalizeUser(response);
}

export async function createUser(payload: CreateUserRequest): Promise<UserItem> {
  const response = await httpPostUserAPI(payload);
  return normalizeUser(response);
}

export async function updateUser(
  id: number,
  payload: UpdateUserRequest,
): Promise<UserItem> {
  const response = await httpPutUserAPI(id, payload);
  return normalizeUser(response);
}

export async function deleteUser(id: number): Promise<void> {
  await httpDeleteUserAPI(id);
}
