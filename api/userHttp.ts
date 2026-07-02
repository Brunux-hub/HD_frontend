import { http } from "@/lib/axios";

import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserItem,
  UserResponse,
} from "@/types/user";


export async function httpGetUsersAPI(): Promise<UserResponse> {
  const response = await http.get<UserResponse>("/user");
  return response.data;
}

export async function httpGetUserByIdAPI(id: number): Promise<UserItem> {
  const response = await http.get<UserItem>(`/user/${id}`);
  return response.data;
}

export async function httpPostUserAPI(payload: CreateUserRequest): Promise<UserItem> {
  const response = await http.post<UserItem>("/user", payload);
  return response.data;
}

export async function httpPutUserAPI(
  id: number,
  payload: UpdateUserRequest,
): Promise<UserItem> {
  const response = await http.put<UserItem>(`/user/${id}`, payload);
  return response.data;
}

export async function httpDeleteUserAPI(id: number): Promise<void> {
  await http.delete(`/user/${id}`);
}
