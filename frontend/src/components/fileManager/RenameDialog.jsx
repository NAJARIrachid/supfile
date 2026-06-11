import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const schema = z.object({
  name: z.string().min(1).max(255),
});

export default function RenameDialog({ open, onClose, initialName, onSubmit, loading, title = 'Renommer' }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: initialName || '' },
  });

  useEffect(() => {
    if (open) reset({ name: initialName || '' });
  }, [open, initialName, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit((d) => onSubmit(d.name))}>
        <DialogContent>
          <TextField
            autoFocus
            label="Nom"
            fullWidth
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            {...register('name')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
