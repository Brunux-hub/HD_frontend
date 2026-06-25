import { create } from 'zustand';
import { User } from '@/types/api';
import { StorageService } from '@/lib/storageService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  login: (accessToken: string, refreshToken: string, expiresIn: number, user: User) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true }),

  login: (accessToken, refreshToken, expiresIn, user) => {
    StorageService.setItem('access_token', accessToken);
    StorageService.setItem('refresh_token', refreshToken);
    StorageService.setItem('expires_in', expiresIn);
    StorageService.setItem('user', user);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    StorageService.clearAll();
    set({ user: null, isAuthenticated: false, isLoading: false });
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  initialize: () => {
    const user = StorageService.getItem<User>('user');
    const token = StorageService.getItem<string>('access_token');
    if (user && token) {
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
