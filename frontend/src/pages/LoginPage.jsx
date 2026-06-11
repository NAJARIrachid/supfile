/**
 * Page de connexion
 */
import { useEffect } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Link,
  Alert,
  Stack,
  CircularProgress,
  Typography,
} from '@mui/material';
import AuthLayout from '@/components/layout/AuthLayout';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/common/ToastProvider';
import { loginSchema } from '@/utils/authSchemas';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, error, clearError } = useAuth();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (searchParams.get('session') === 'expired') {
      showToast('Session expirée, veuillez vous reconnecter.', 'warning');
    }
  }, [searchParams, showToast]);

  const onSubmit = async (data) => {
    clearError();
    try {
      await login(data.email, data.password);
      showToast('Connexion réussie', 'success');
      navigate('/files', { replace: true });
    } catch {
      // erreur affichée via le store
    }
  };

  return (
    <AuthLayout title="Connexion" subtitle="Accédez à votre espace cloud">
      <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Email"
          type="email"
          fullWidth
          autoComplete="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register('email')}
        />

        <TextField
          label="Mot de passe"
          type="password"
          fullWidth
          autoComplete="current-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
        </Button>

        <Typography variant="body2" textAlign="center">
          Pas encore de compte ?{' '}
          <Link component={RouterLink} to="/register">
            Créer un compte
          </Link>
        </Typography>
      </Stack>
    </AuthLayout>
  );
}
