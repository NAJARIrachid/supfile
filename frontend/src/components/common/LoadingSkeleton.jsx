/**
 * Squelette de chargement réutilisable
 */
import { Skeleton, Stack, Box } from '@mui/material';

export function PageLoadingSkeleton({ rows = 4 }) {
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
      <Stack spacing={1}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={56} />
        ))}
      </Stack>
    </Box>
  );
}

export default PageLoadingSkeleton;
