import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import * as shareService from '@/services/share.service';
import { useToast } from '@/components/common/ToastProvider';

export default function ShareDialog({ open, onClose, file, folder }) {
  const { showToast } = useToast();
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { password: '', expiresAt: '' },
  });

  const handleClose = () => {
    reset();
    setLink('');
    onClose();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        fileId: file?.id,
        folderId: folder?.id,
        password: data.password || undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
      };
      const result = await shareService.createShare(payload);
      const token = result.token;
      const url = `${window.location.origin}/share/${token}`;
      setLink(url);
      showToast('Lien de partage créé', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    showToast('Lien copié dans le presse-papiers', 'success');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Partager « {file?.name || folder?.name} »
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Mot de passe (optionnel)"
              type="password"
              fullWidth
              {...register('password')}
            />
            <TextField
              label="Expiration"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('expiresAt')}
            />
            {link && (
              <Alert severity="success">
                <Typography variant="body2" sx={{ wordBreak: 'break-all', mb: 1 }}>
                  {link}
                </Typography>
                <Button size="small" startIcon={<ContentCopyIcon />} onClick={copyLink}>
                  Copier le lien
                </Button>
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fermer</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            Générer le lien
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
