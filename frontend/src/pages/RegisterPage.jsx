/**
 * Page d'inscription
 */
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import { registerSchema } from '@/utils/authSchemas';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    clearError();
    try {
      await registerUser(data.email, data.password);
      showToast('Compte créé avec succès', 'success');
      navigate('/files', { replace: true });
    } catch {
      // erreur via store
    }
  };

  return (
    <AuthLayout title="Créer un compte" subtitle="15 Go gratuits pour vos fichiers">
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
          autoComplete="new-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register('password')}
        />

        <TextField
          label="Confirmer le mot de passe"
          type="password"
          fullWidth
          autoComplete="new-password"
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "S'inscrire"}
        </Button>

        <Typography variant="body2" textAlign="center">
          Déjà un compte ?{' '}
          <Link component={RouterLink} to="/login">
            Se connecter
          </Link>
        </Typography>
      </Stack>
    </AuthLayout>
  );
}
