/**
 * Callback OAuth Google — récupère ?token= depuis l'URL
 */
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/common/ToastProvider';
import { jwtDecode } from '@/utils/jwtDecode';

export default function AuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      showToast('Authentification Google échouée', 'error');
      navigate('/login');
      return;
    }

    try {
      const payload = jwtDecode(token);
      setSession(
        { id: payload.userId, email: payload.email },
        token
      );
      showToast('Connexion Google réussie', 'success');
      navigate('/files', { replace: true });
    } catch {
      showToast('Token invalide', 'error');
      navigate('/login');
    }
  }, [params, navigate, setSession, showToast]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary">Connexion en cours…</Typography>
    </Box>
  );
}
