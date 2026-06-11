import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import * as dashboardService from '@/services/dashboard.service';
import QuotaCard from '@/components/dashboard/QuotaCard';
import StorageChart from '@/components/dashboard/StorageChart';
import { PageLoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { getFileIcon, formatBytes } from '@/utils/fileUtils';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboard,
  });

  if (isLoading) return <PageLoadingSkeleton rows={5} />;

  const stats = data?.stats || {};

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <QuotaCard stats={stats} />
        </Grid>
        <Grid item xs={12} md={7}>
          <StorageChart storageByCategory={data?.storageByCategory} />
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h4" color="primary">
              {stats.fileCount ?? 0}
            </Typography>
            <Typography color="text.secondary">Fichiers</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h4" color="primary">
              {stats.folderCount ?? 0}
            </Typography>
            <Typography color="text.secondary">Dossiers</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h4" color="error">
              {stats.trashCount ?? 0}
            </Typography>
            <Typography color="text.secondary">Corbeille</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              5 derniers fichiers
            </Typography>
            <List dense>
              {(data?.recentFiles || []).map((file) => {
                const Icon = getFileIcon(file.mimeType);
                return (
                  <ListItem key={file.id}>
                    <ListItemIcon>
                      <Icon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${formatBytes(file.size)} — ${new Date(file.updatedAt).toLocaleString('fr-FR')}`}
                    />
                  </ListItem>
                );
              })}
              {(data?.recentFiles || []).length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  Aucun fichier récent
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
