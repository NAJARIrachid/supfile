import apiClient from '@/api/apiClient';

export async function search(query) {
  const { data } = await apiClient.get('/search', { params: { q: query } });
  return data.data;
}
