import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Grid, Typography } from '@mui/material';
import FileManagerToolbar from './FileManagerToolbar';
import UploadZone from './UploadZone';
import FolderCard from './FolderCard';
import FileCard from './FileCard';
import FileTable from './FileTable';
import CreateFolderDialog from './CreateFolderDialog';
import RenameDialog from './RenameDialog';
import MoveDialog from './MoveDialog';
import FilePreviewModal from './FilePreviewModal';
import ShareDialog from '../sharing/ShareDialog';
import { PageLoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useFileManagerStore } from '@/store/fileManagerStore';
import * as foldersService from '@/services/folders.service';
import * as filesService from '@/services/files.service';
import { downloadFile, downloadFolderZip } from '@/utils/download';
import { useToast } from '@/components/common/ToastProvider';

export default function FileExplorer() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { currentFolderId, viewMode, openFolder } = useFileManagerStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [moveTarget, setMoveTarget] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);

  const folderKey = ['folders', currentFolderId];
  const fileKey = ['files', currentFolderId];

  const { data: folders = [], isLoading: loadingFolders } = useQuery({
    queryKey: folderKey,
    queryFn: () => foldersService.listFolders(currentFolderId),
  });

  const { data: files = [], isLoading: loadingFiles } = useQuery({
    queryKey: fileKey,
    queryFn: () => filesService.listFiles(currentFolderId),
  });

  const { data: rootFolders = [] } = useQuery({
    queryKey: ['folders', null],
    queryFn: () => foldersService.listFolders(null),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['folders'] });
    queryClient.invalidateQueries({ queryKey: ['files'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const createFolderMutation = useMutation({
    mutationFn: (name) => foldersService.createFolder(name, currentFolderId),
    onSuccess: () => {
      showToast('Dossier créé', 'success');
      invalidate();
    },
    onError: (e) => showToast(e.message, 'error'),
  });

  const renameMutation = useMutation({
    mutationFn: async ({ item, type, name }) => {
      if (type === 'folder') return foldersService.updateFolder(item.id, { name });
      return filesService.updateFile(item.id, { name });
    },
    onSuccess: () => {
      showToast('Renommé', 'success');
      setRenameTarget(null);
      invalidate();
    },
    onError: (e) => showToast(e.message, 'error'),
  });

  const moveMutation = useMutation({
    mutationFn: async ({ item, folderId }) =>
      filesService.updateFile(item.id, { folderId }),
    onSuccess: () => {
      showToast('Fichier déplacé', 'success');
      setMoveTarget(null);
      invalidate();
    },
    onError: (e) => showToast(e.message, 'error'),
  });

  const deleteFolderMutation = useMutation({
    mutationFn: (id) => foldersService.deleteFolder(id),
    onSuccess: () => {
      showToast('Dossier supprimé', 'success');
      invalidate();
    },
    onError: (e) => showToast(e.message, 'error'),
  });

  const deleteFileMutation = useMutation({
    mutationFn: (id) => filesService.deleteFile(id),
    onSuccess: () => {
      showToast('Fichier déplacé vers la corbeille', 'success');
      invalidate();
    },
    onError: (e) => showToast(e.message, 'error'),
  });

  const actions = {
    onOpen: (folder) => openFolder(folder),
    onPreview: setPreviewFile,
    onDownload: async (item) => {
      try {
        if (item.mimeType) {
          await downloadFile(item.id, item.name);
        } else {
          await downloadFolderZip(item.id, item.name);
        }
      } catch (e) {
        showToast(e.message, 'error');
      }
    },
    onRename: (item) =>
      setRenameTarget({ item, type: item.mimeType ? 'file' : 'folder' }),
    onMove: (item) => setMoveTarget(item),
    onDelete: (item) => {
      if (item.mimeType) deleteFileMutation.mutate(item.id);
      else if (window.confirm(`Supprimer le dossier « ${item.name} » ?`)) {
        deleteFolderMutation.mutate(item.id);
      }
    },
    onShare: (item) =>
      setShareTarget(
        item.mimeType ? { file: item } : { folder: item }
      ),
  };

  const loading = loadingFolders || loadingFiles;
  const moveFolderOptions = [...rootFolders, ...folders];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Mes fichiers
      </Typography>

      <FileManagerToolbar onCreateFolder={() => setCreateOpen(true)} />
      <UploadZone folderId={currentFolderId} onUploaded={invalidate} />

      {loading ? (
        <PageLoadingSkeleton rows={6} />
      ) : viewMode === 'list' ? (
        <FileTable folders={folders} files={files} actions={actions} />
      ) : (
        <Grid container spacing={2}>
          {folders.map((folder) => (
            <Grid key={folder.id} item xs={6} sm={4} md={3} lg={2}>
              <FolderCard folder={folder} {...actions} />
            </Grid>
          ))}
          {files.map((file) => (
            <Grid key={file.id} item xs={6} sm={4} md={3} lg={2}>
              <FileCard file={file} {...actions} />
            </Grid>
          ))}
          {folders.length === 0 && files.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary" textAlign="center" py={6}>
                Ce dossier est vide — glissez des fichiers pour commencer
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      <CreateFolderDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        loading={createFolderMutation.isPending}
        onSubmit={(name) => createFolderMutation.mutateAsync(name)}
      />

      <RenameDialog
        open={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        initialName={renameTarget?.item?.name}
        loading={renameMutation.isPending}
        onSubmit={(name) =>
          renameMutation.mutate({
            item: renameTarget.item,
            type: renameTarget.type,
            name,
          })
        }
      />

      <MoveDialog
        open={Boolean(moveTarget)}
        onClose={() => setMoveTarget(null)}
        folders={moveFolderOptions}
        loading={moveMutation.isPending}
        onSelect={(folderId) => moveMutation.mutate({ item: moveTarget, folderId })}
      />

      <FilePreviewModal
        open={Boolean(previewFile)}
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <ShareDialog
        open={Boolean(shareTarget)}
        onClose={() => setShareTarget(null)}
        file={shareTarget?.file}
        folder={shareTarget?.folder}
      />
    </Box>
  );
}
