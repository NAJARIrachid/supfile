import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, LinearProgress, Stack, Paper } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import * as filesService from '@/services/files.service';
import { useToast } from '@/components/common/ToastProvider';

export default function UploadZone({ folderId, onUploaded }) {
  const { showToast } = useToast();
  const [uploads, setUploads] = useState([]);

  const uploadOne = useCallback(
    async (file) => {
      const id = `${file.name}-${Date.now()}`;
      setUploads((prev) => [...prev, { id, name: file.name, progress: 0 }]);

      try {
        await filesService.uploadFile(file, folderId, (progress) => {
          setUploads((prev) =>
            prev.map((u) => (u.id === id ? { ...u, progress } : u))
          );
        });
        showToast(`${file.name} envoyé`, 'success');
        onUploaded?.();
      } catch (err) {
        showToast(err.message || `Échec : ${file.name}`, 'error');
      } finally {
        setUploads((prev) => prev.filter((u) => u.id !== id));
      }
    },
    [folderId, onUploaded, showToast]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => uploadOne(file));
    },
    [uploadOne]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <Box sx={{ mb: 2 }}>
      <Paper
        variant="outlined"
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          borderStyle: 'dashed',
          bgcolor: isDragActive ? 'action.selected' : 'transparent',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          transition: '0.2s',
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {isDragActive
            ? 'Déposez les fichiers ici…'
            : 'Glissez-déposez ou cliquez pour envoyer (multi-fichiers)'}
        </Typography>
      </Paper>

      {uploads.length > 0 && (
        <Stack spacing={1} sx={{ mt: 2 }}>
          {uploads.map((u) => (
            <Box key={u.id}>
              <Typography variant="caption" noWrap>
                {u.name} — {u.progress}%
              </Typography>
              <LinearProgress variant="determinate" value={u.progress} />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
