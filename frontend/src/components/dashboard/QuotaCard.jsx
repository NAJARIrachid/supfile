import { Paper, Typography, LinearProgress, Stack, Box } from '@mui/material';
import { formatBytes } from '@/utils/fileUtils';

export default function QuotaCard({ stats }) {
  const used = Number(stats?.totalSizeBytes || 0);
  const quota = Number(stats?.quotaBytes || 15 * 1024 ** 3);
  const available = Number(stats?.availableBytes || quota - used);
  const percent = stats?.usedPercent ?? (used / quota) * 100;

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Espace de stockage
      </Typography>
      <LinearProgress
        variant="determinate"
        value={Math.min(percent, 100)}
        sx={{ height: 10, borderRadius: 5, mb: 2 }}
      />
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Utilisé
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatBytes(used)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Disponible
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatBytes(available)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Quota total
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatBytes(quota)}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
