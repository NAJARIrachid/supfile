import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useThemeMode } from '@/contexts/ThemeModeContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/common/ToastProvider';
import * as userService from '@/services/user.service';
import { setStoredUser } from '@/utils/tokenStorage';
import { useAuthStore } from '@/store/authStore';

const profileSchema = z.object({
  email: z.string().email(),
  avatar: z.string().url().optional().or(z.literal('')),
  password: z.string().min(8).optional().or(z.literal('')),
});

export default function SettingsPage() {
  const { user } = useAuth();
  const { mode, setMode } = useThemeMode();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email || '',
      avatar: user?.avatar || '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        email: data.email,
        avatar: data.avatar || null,
      };
      if (data.password) payload.password = data.password;

      const updated = await userService.updateProfile(payload);
      setStoredUser(updated);
      useAuthStore.setState({ user: updated });
      showToast('Profil mis à jour', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <Box maxWidth={560}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Paramètres
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Apparence
        </Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, v) => v && setMode(v)}
          size="small"
        >
          <ToggleButton value="light">
            <LightModeIcon sx={{ mr: 1 }} fontSize="small" />
            Clair
          </ToggleButton>
          <ToggleButton value="dark">
            <DarkModeIcon sx={{ mr: 1 }} fontSize="small" />
            Sombre
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="subtitle1" gutterBottom>
          Compte
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Email"
            fullWidth
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register('email')}
          />
          <TextField
            label="URL de l'avatar"
            fullWidth
            placeholder="https://…"
            error={Boolean(errors.avatar)}
            helperText={errors.avatar?.message || 'Lien vers une image de profil'}
            {...register('avatar')}
          />
          <Divider />
          <TextField
            label="Nouveau mot de passe"
            type="password"
            fullWidth
            error={Boolean(errors.password)}
            helperText={errors.password?.message || 'Laisser vide pour ne pas changer'}
            {...register('password')}
          />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Enregistrer
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
