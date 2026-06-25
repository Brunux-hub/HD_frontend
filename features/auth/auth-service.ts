import api from '@/api/client';
import { LoginResponse, User } from '@/types/api';

export const authService = {
  login: async (username: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/auth/login', { username, password });
    return data;
  },

  refresh: async (refreshToken: string) => {
    const { data } = await api.post<LoginResponse>('/auth/refresh', refreshToken);
    return data;
  },

  me: async () => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};
