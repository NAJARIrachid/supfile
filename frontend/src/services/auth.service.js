/**
 * Service d'authentification — appels API register / login
 */
import apiClient from '@/api/apiClient';

export async function register(email, password) {
  const { data } = await apiClient.post('/auth/register', { email, password });
  return data.data;
}

export async function login(email, password) {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data.data;
}
