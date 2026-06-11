import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export default function PublicSharePage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const accessShare = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await publicApi.get(`/share/${token}`, {
        params: password ? { password } : {},
        responseType: 'blob',
      });

      const disposition = response.headers['content-disposition'];
      let filename = 'download';
      const match = disposition?.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];

      const url = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          'Impossible d\'accéder à ce partage'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Fichier partagé SUPFile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ce lien peut être protégé par mot de passe.
        </Typography>
        <TextField
          label="Mot de passe"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          fullWidth
          onClick={accessShare}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Télécharger'}
        </Button>
      </Paper>
    </Box>
  );
}
