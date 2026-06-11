import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import * as trashService from '@/services/trash.service';
import { PageLoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useToast } from '@/components/common/ToastProvider';
import { formatBytes, getFileIcon } from '@/utils/fileUtils';

export default function TrashPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['trash'],
    queryFn: trashService.listTrash,
  });

  const restoreMutation = useMutation({
    mutationFn: trashService.restoreFile,
    onSuccess: () => {
      showToast('Fichier restauré', 'success');
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (e) => showToast(e.message, 'error'),
  });

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Corbeille
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Taille</TableCell>
              <TableCell>Supprimé le</TableCell>
              <TableCell width={80} />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((file) => {
              const Icon = getFileIcon(file.mimeType);
              return (
                <TableRow key={file.id}>
                  <TableCell>
                    <Icon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 18 }} />
                    {file.name}
                  </TableCell>
                  <TableCell>{formatBytes(file.size)}</TableCell>
                  <TableCell>
                    {new Date(file.deletedAt).toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Restaurer">
                      <IconButton
                        size="small"
                        onClick={() => restoreMutation.mutate(file.id)}
                      >
                        <RestoreFromTrashIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary" py={4}>
                    La corbeille est vide
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
