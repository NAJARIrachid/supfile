import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Paper, Typography } from '@mui/material';
import { formatBytes } from '@/utils/fileUtils';

const COLORS = ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#9aa0a6'];

const LABELS = {
  documents: 'Documents',
  images: 'Images',
  videos: 'Vidéos',
  audio: 'Audio',
  other: 'Autre',
};

export default function StorageChart({ storageByCategory = {} }) {
  const data = Object.entries(storageByCategory)
    .map(([key, value]) => ({
      name: LABELS[key] || key,
      value: Number(value) || 0,
    }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 3, height: 320 }}>
        <Typography color="text.secondary" textAlign="center">
          Aucune donnée de stockage
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, height: 320 }}>
      <Typography variant="subtitle1" gutterBottom>
        Répartition par type
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => formatBytes(v)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}
