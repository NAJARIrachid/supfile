/**
 * Store Zustand — session utilisateur et JWT
 */
import { create } from 'zustand';
import {
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  clearAuthStorage,
} from '@/utils/tokenStorage';
import * as authService from '@/services/auth.service';

export const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  token: getToken(),
  isAuthenticated: Boolean(getToken()),
  isLoading: false,
  error: null,

  /** Restaure la session au chargement de l'app */
  hydrate() {
    const token = getToken();
    const user = getStoredUser();
    set({
      token,
      user,
      isAuthenticated: Boolean(token),
    });
  },

  async login(email, password) {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.login(email, password);
      setToken(token);
      setStoredUser(user);
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { user, token };
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  async register(email, password) {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.register(email, password);
      setToken(token);
      setStoredUser(user);
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { user, token };
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  /** Connexion via redirect OAuth (?token=) */
  setSession(user, token) {
    setToken(token);
    setStoredUser(user);
    set({ user, token, isAuthenticated: true, error: null });
  },

  logout() {
    clearAuthStorage();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError() {
    set({ error: null });
  },
}));
