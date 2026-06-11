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
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';

export default function FolderCard({ folder, onOpen, onRename, onDelete, onDownload, onShare }) {
  const [anchor, setAnchor] = useState(null);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardActionArea onClick={() => onOpen(folder)} sx={{ height: '100%' }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <FolderIcon sx={{ fontSize: 56, color: 'warning.main', mb: 1 }} />
          <Typography variant="body2" noWrap fontWeight={500}>
            {folder.name}
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
          <MenuItem onClick={() => { setAnchor(null); onRename(folder); }}>Renommer</MenuItem>
          <MenuItem onClick={() => { setAnchor(null); onShare(folder); }}>Partager</MenuItem>
          <MenuItem onClick={() => { setAnchor(null); onDownload(folder); }}>Télécharger ZIP</MenuItem>
          <MenuItem onClick={() => { setAnchor(null); onDelete(folder); }} sx={{ color: 'error.main' }}>
            Supprimer
          </MenuItem>
        </Menu>
      </Box>
    </Card>
  );
}
