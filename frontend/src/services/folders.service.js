import apiClient from '@/api/apiClient';

export async function listFolders(parentId = null) {
  const params = parentId ? { parentId } : {};
  const { data } = await apiClient.get('/folders', { params });
  return data.data;
}

export async function getFolder(id) {
  const { data } = await apiClient.get(`/folders/${id}`);
  return data.data;
}

export async function createFolder(name, parentId = null) {
  const { data } = await apiClient.post('/folders', { name, parentId });
  return data.data;
}

export async function updateFolder(id, payload) {
  const { data } = await apiClient.put(`/folders/${id}`, payload);
  return data.data;
}

export async function deleteFolder(id) {
  const { data } = await apiClient.delete(`/folders/${id}`);
  return data;
}
