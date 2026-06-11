import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';

export default function MoveDialog({
  open,
  onClose,
  folders = [],
  excludeId,
  onSelect,
  loading,
  title = 'Déplacer vers',
}) {
  const [selected, setSelected] = useState(null);

  const available = folders.filter((f) => f.id !== excludeId);

  const handleConfirm = () => {
    onSelect(selected);
    setSelected(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <List dense>
          <ListItemButton
            selected={selected === null}
            onClick={() => setSelected(null)}
          >
            <HomeOutlinedIcon sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText primary="Racine (Mes fichiers)" />
          </ListItemButton>
          {available.map((folder) => (
            <ListItemButton
              key={folder.id}
              selected={selected === folder.id}
              onClick={() => setSelected(folder.id)}
            >
              <FolderOutlinedIcon sx={{ mr: 2, color: 'warning.main' }} />
              <ListItemText primary={folder.name} />
            </ListItemButton>
          ))}
          {available.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              Aucun autre dossier disponible à ce niveau.
            </Typography>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleConfirm} disabled={loading}>
          Déplacer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
