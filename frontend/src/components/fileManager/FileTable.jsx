import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { getFileIcon, formatBytes } from '@/utils/fileUtils';

function RowMenu({ item, type, actions }) {
  const [anchor, setAnchor] = useState(null);
  const isFolder = type === 'folder';

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {isFolder ? (
          <>
            <MenuItem onClick={() => { setAnchor(null); actions.onOpen(item); }}>Ouvrir</MenuItem>
            <MenuItem onClick={() => { setAnchor(null); actions.onRename(item); }}>Renommer</MenuItem>
            <MenuItem onClick={() => { setAnchor(null); actions.onShare(item); }}>Partager</MenuItem>
            <MenuItem onClick={() => { setAnchor(null); actions.onDownload(item); }}>ZIP</MenuItem>
            <MenuItem onClick={() => { setAnchor(null); actions.onDelete(item); }} sx={{ color: 'error.main' }}>Supprimer</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => { setAnchor(null); actions.onPreview(item); }}>Aperçu</MenuItem>
            <MenuItem onClick={() => { setAnchor(null); actions.onDownload(item); }}>Télécharger</MenuItem>
            <MenuItem onClick={() => { setAnchor(null); actions.onRename(item); }}>Renommer</MenuItem>
            <MenuItem onClick={() => { setAnchor(null); actions.onMove(item); }}>Déplacer</MenuItem>
            <MenuItem onClick={() => { setAnchor(null); actions.onShare(item); }}>Partager</MenuItem>
            <MenuItem onClick={() => { setAnchor(null); actions.onDelete(item); }} sx={{ color: 'error.main' }}>Supprimer</MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}

export default function FileTable({ folders, files, actions }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell width={120}>Taille</TableCell>
            <TableCell width={160}>Modifié</TableCell>
            <TableCell width={56} />
          </TableRow>
        </TableHead>
        <TableBody>
          {folders.map((folder) => (
            <TableRow
              key={folder.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => actions.onOpen(folder)}
            >
              <TableCell>
                <FolderIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'warning.main' }} />
                {folder.name}
              </TableCell>
              <TableCell>—</TableCell>
              <TableCell>
                {new Date(folder.updatedAt).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <RowMenu item={folder} type="folder" actions={actions} />
              </TableCell>
            </TableRow>
          ))}
          {files.map((file) => {
            const Icon = getFileIcon(file.mimeType);
            return (
              <TableRow
                key={file.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => actions.onPreview(file)}
              >
                <TableCell>
                  <Icon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20, color: 'primary.main' }} />
                  {file.name}
                </TableCell>
                <TableCell>{formatBytes(file.size)}</TableCell>
                <TableCell>
                  {new Date(file.updatedAt).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <RowMenu item={file} type="file" actions={actions} />
                </TableCell>
              </TableRow>
            );
          })}
          {folders.length === 0 && files.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography color="text.secondary" py={4}>
                  Ce dossier est vide
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
