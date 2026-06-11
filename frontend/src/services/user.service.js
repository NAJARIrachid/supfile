import apiClient from '@/api/apiClient';

export async function updateProfile(payload) {
  const { data } = await apiClient.patch('/users/me', payload);
  return data.data;
}
