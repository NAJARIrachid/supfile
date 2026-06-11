import apiClient from '@/api/apiClient';

export async function createShare(payload) {
  const { data } = await apiClient.post('/share', payload);
  return data.data;
}

export async function getPublicShare(token, password) {
  const params = password ? { password } : {};
  const { data } = await apiClient.get(`/share/${token}`, { params });
  return data;
}
