import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from '@mui/icons-material/Folder';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import * as searchService from '@/services/search.service';
import { getFileIcon, filterByCategory, filterByDate } from '@/utils/fileUtils';

const FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'images', label: 'Images' },
  { id: 'documents', label: 'Documents' },
  { id: 'audio', label: 'Audio' },
  { id: 'video', label: 'Vidéo' },
];

const DATE_FILTERS = [
  { id: 'all', label: 'Toutes dates' },
  { id: 'day', label: '24 h' },
  { id: 'week', label: '7 jours' },
  { id: 'month', label: '30 jours' },
];

export default function SearchDialog({ open, onClose, onOpenFile, onOpenFolder }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const debounced = useDebounce(query, 400);

  const { data, isFetching } = useQuery({
    queryKey: ['search', debounced],
    queryFn: () => searchService.search(debounced),
    enabled: open && debounced.length >= 2,
  });

  let files = data?.files || [];
  files = filterByCategory(files, category);
  files = filterByDate(files, dateRange);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rechercher</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          placeholder="Nom de fichier ou dossier…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 1 }}>
          {FILTERS.map((f) => (
            <Chip
              key={f.id}
              label={f.label}
              size="small"
              color={category === f.id ? 'primary' : 'default'}
              onClick={() => setCategory(f.id)}
            />
          ))}
        </Stack>
        <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
          {DATE_FILTERS.map((f) => (
            <Chip
              key={f.id}
              label={f.label}
              size="small"
              variant="outlined"
              color={dateRange === f.id ? 'primary' : 'default'}
              onClick={() => setDateRange(f.id)}
            />
          ))}
        </Stack>

        {isFetching && <CircularProgress size={24} />}
        {debounced.length < 2 && (
          <Typography variant="body2" color="text.secondary">
            Saisissez au moins 2 caractères
          </Typography>
        )}

        <List dense>
          {(data?.folders || []).map((folder) => (
            <ListItemButton
              key={folder.id}
              onClick={() => {
                onOpenFolder?.(folder);
                onClose();
              }}
            >
              <ListItemIcon>
                <FolderIcon color="warning" />
              </ListItemIcon>
              <ListItemText primary={folder.name} secondary="Dossier" />
            </ListItemButton>
          ))}
          {files.map((file) => {
            const Icon = getFileIcon(file.mimeType);
            return (
              <ListItemButton
                key={file.id}
                onClick={() => {
                  onOpenFile?.(file);
                  onClose();
                }}
              >
                <ListItemIcon>
                  <Icon color="primary" />
                </ListItemIcon>
                <ListItemText primary={file.name} secondary="Fichier" />
              </ListItemButton>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
}
