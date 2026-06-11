/**
 * Utilitaires fichiers — catégories MIME, formatage taille, icônes
 */
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import VideoFileOutlinedIcon from '@mui/icons-material/VideoFileOutlined';
import AudioFileOutlinedIcon from '@mui/icons-material/AudioFileOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

export const FILE_CATEGORIES = {
  images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  documents: ['application/pdf', 'text/plain', 'text/markdown'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
};

export function getFileCategory(mimeType = '') {
  if (mimeType.startsWith('image/')) return 'images';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('text') ||
    mimeType.includes('spreadsheet')
  ) {
    return 'documents';
  }
  return 'other';
}

export function formatBytes(bytes) {
  const n = Number(bytes || 0);
  if (n === 0) return '0 o';
  const k = 1024;
  const sizes = ['o', 'Ko', 'Mo', 'Go', 'To'];
  const i = Math.floor(Math.log(n) / Math.log(k));
  return `${parseFloat((n / k ** i).toFixed(1))} ${sizes[i]}`;
}

export function canPreview(mimeType = '') {
  if (FILE_CATEGORIES.images.some((m) => mimeType.startsWith('image/'))) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('text/')) return 'text';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  return null;
}

export function getFileIcon(mimeType) {
  const cat = getFileCategory(mimeType);
  switch (cat) {
    case 'images':
      return ImageOutlinedIcon;
    case 'video':
      return VideoFileOutlinedIcon;
    case 'audio':
      return AudioFileOutlinedIcon;
    case 'documents':
      if (mimeType.includes('pdf')) return PictureAsPdfOutlinedIcon;
      return DescriptionOutlinedIcon;
    default:
      return InsertDriveFileOutlinedIcon;
  }
}

export function filterByCategory(files, category) {
  if (!category || category === 'all') return files;
  return files.filter((f) => getFileCategory(f.mimeType) === category);
}

export function filterByDate(files, range) {
  if (!range || range === 'all') return files;
  const now = Date.now();
  const day = 86400000;
  const limits = { day: day, week: 7 * day, month: 30 * day };
  const maxAge = limits[range];
  if (!maxAge) return files;
  return files.filter((f) => now - new Date(f.createdAt).getTime() <= maxAge);
}
