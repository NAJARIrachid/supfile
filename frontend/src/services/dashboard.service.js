import apiClient from '@/api/apiClient';

export async function getDashboard() {
  const { data } = await apiClient.get('/dashboard');
  return data.data;
}
