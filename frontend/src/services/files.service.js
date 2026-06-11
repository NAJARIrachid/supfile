import apiClient from '@/api/apiClient';

export async function listFiles(folderId = null) {
  const params = folderId ? { folderId } : {};
  const { data } = await apiClient.get('/files', { params });
  return data.data;
}

export async function uploadFile(file, folderId = null, onProgress) {
  const form = new FormData();
  form.append('file', file);
  if (folderId) form.append('folderId', folderId);

  const { data } = await apiClient.post('/files/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return data.data;
}

export async function updateFile(id, payload) {
  const { data } = await apiClient.put(`/files/${id}`, payload);
  return data.data;
}

export async function deleteFile(id) {
  const { data } = await apiClient.delete(`/files/${id}`);
  return data;
}
