/**
 * Client Axios centralisé — intercepteurs JWT et gestion d'erreurs API
 */
import axios from 'axios';
import { getToken, clearAuthStorage } from '@/utils/tokenStorage';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Injection du Bearer token sur chaque requête authentifiée */
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** Normalisation des erreurs backend { success, error: { code, message } } */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const apiMessage = error.response?.data?.error?.message;

    const isPublicShare = error.config?.url?.includes('/share/');
    if (status === 401 && !isPublicShare) {
      clearAuthStorage();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?session=expired';
      }
    }

    const message =
      apiMessage ||
      error.message ||
      'Une erreur est survenue. Veuillez réessayer.';

    return Promise.reject({
      status,
      code: error.response?.data?.error?.code,
      message,
      original: error,
    });
  }
);

export default apiClient;
