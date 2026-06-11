import apiClient from '@/api/apiClient';

export async function listTrash() {
  const { data } = await apiClient.get('/trash');
  return data.data;
}

export async function restoreFile(id) {
  const { data } = await apiClient.post(`/trash/restore/${id}`);
  return data.data;
}
