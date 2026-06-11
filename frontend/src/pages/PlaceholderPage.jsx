/**
 * Page temporaire — fonctionnalité à venir (phase 2+)
 */
import { Box, Typography, Paper } from '@mui/material';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';

export default function PlaceholderPage({ title, description }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 6,
        textAlign: 'center',
        borderStyle: 'dashed',
        bgcolor: 'background.paper',
      }}
    >
      <ConstructionOutlinedIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary" maxWidth={480} mx="auto">
        {description}
      </Typography>
    </Paper>
  );
}
