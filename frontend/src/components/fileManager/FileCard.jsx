import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { getFileIcon, formatBytes } from '@/utils/fileUtils';

export default function FileCard({
  file,
  onPreview,
  onDownload,
  onRename,
  onMove,
  onDelete,
  onShare,
}) {
  const [anchor, setAnchor] = useState(null);
  const Icon = getFileIcon(file.mimeType);

  return (
    <Card variant="outlined" sx={{ position: 'relative', height: '100%' }}>
      <CardActionArea onClick={() => onPreview(file)} sx={{ height: '100%' }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Icon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="body2" noWrap fontWeight={500}>
            {file.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatBytes(file.size)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setAnchor(e.currentTarget);
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          <MenuItem onClick={() => { setAnchor(null); onDownload(file); }}>Télécharger</MenuItem>
          <MenuItem onClick={() => { setAnchor(null); onRename(file); }}>Renommer</MenuItem>
          <MenuItem onClick={() => { setAnchor(null); onMove(file); }}>Déplacer</MenuItem>
          <MenuItem onClick={() => { setAnchor(null); onShare(file); }}>Partager</MenuItem>
          <MenuItem onClick={() => { setAnchor(null); onDelete(file); }} sx={{ color: 'error.main' }}>
            Supprimer
          </MenuItem>
        </Menu>
      </Box>
    </Card>
  );
}
