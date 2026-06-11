import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import * as dashboardService from '@/services/dashboard.service';
import { PageLoadingSkeleton } from '@/components/common/LoadingSkeleton';

export default function SharedPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboard,
  });

  if (isLoading) return <PageLoadingSkeleton />;

  const shared = data?.sharedWithMe || [];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Partagés avec moi
      </Typography>
      <Paper variant="outlined">
        <List>
          {shared.map((entry) => (
            <ListItem key={entry.id}>
              <ListItemIcon>
                <FolderSharedIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={entry.folder?.name}
                secondary={`Partagé par ${entry.owner?.email}`}
              />
            </ListItem>
          ))}
          {shared.length === 0 && (
            <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
              Aucun dossier partagé avec vous pour le moment
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
}
