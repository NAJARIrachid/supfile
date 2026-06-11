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
  name: z.string().min(1, 'Nom requis').max(255),
});

export default function CreateFolderDialog({ open, onClose, onSubmit, loading }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async (data) => {
    await onSubmit(data.name);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Nouveau dossier</DialogTitle>
      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <TextField
            autoFocus
            label="Nom du dossier"
            fullWidth
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            {...register('name')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            Créer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
