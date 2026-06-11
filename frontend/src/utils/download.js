/**
 * Téléchargement blob depuis l'API authentifiée
 */
import apiClient from '@/api/apiClient';

export async function downloadFile(fileId, filename) {
  const response = await apiClient.get(`/files/download/${fileId}`, {
    responseType: 'blob',
  });
  triggerDownload(response.data, filename);
}

export async function downloadFolderZip(folderId, folderName) {
  const response = await apiClient.get(`/folders/download/${folderId}`, {
    responseType: 'blob',
  });
  triggerDownload(response.data, `${folderName || 'dossier'}.zip`);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function fetchFileBlob(fileId) {
  const response = await apiClient.get(`/files/download/${fileId}`, {
    responseType: 'blob',
  });
  return response.data;
}
