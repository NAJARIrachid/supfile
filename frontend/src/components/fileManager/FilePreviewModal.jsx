import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { fetchFileBlob } from '@/utils/download';
import { canPreview } from '@/utils/fileUtils';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function FilePreviewModal({ open, file, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [numPages, setNumPages] = useState(null);

  const previewType = file ? canPreview(file.mimeType) : null;

  useEffect(() => {
    if (!open || !file) return undefined;

    let revoked = false;
    setLoading(true);

    (async () => {
      try {
        const blob = await fetchFileBlob(file.id);
        if (revoked) return;

        if (previewType === 'text') {
          const text = await blob.text();
          setTextContent(text);
        } else {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
        }
      } finally {
        if (!revoked) setLoading(false);
      }
    })();

    return () => {
      revoked = true;
      setBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setTextContent('');
      setNumPages(null);
    };
  }, [open, file, previewType]);

  if (!file) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', pr: 6 }}>
        {file.name}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ minHeight: 320, display: 'flex', justifyContent: 'center' }}>
        {loading && <CircularProgress />}
        {!loading && !previewType && (
          <Typography color="text.secondary">Aperçu non disponible pour ce type de fichier.</Typography>
        )}
        {!loading && previewType === 'image' && blobUrl && (
          <Box component="img" src={blobUrl} alt={file.name} sx={{ maxWidth: '100%', maxHeight: '70vh' }} />
        )}
        {!loading && previewType === 'pdf' && blobUrl && (
          <Document file={blobUrl} onLoadSuccess={({ numPages: n }) => setNumPages(n)}>
            {Array.from({ length: numPages || 0 }, (_, i) => (
              <Page key={i + 1} pageNumber={i + 1} width={560} />
            ))}
          </Document>
        )}
        {!loading && previewType === 'text' && (
          <Box
            component="pre"
            sx={{
              width: '100%',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: 13,
              whiteSpace: 'pre-wrap',
            }}
          >
            {textContent}
          </Box>
        )}
        {!loading && previewType === 'audio' && blobUrl && (
          <audio controls src={blobUrl} style={{ width: '100%' }} />
        )}
        {!loading && previewType === 'video' && blobUrl && (
          <video controls src={blobUrl} style={{ maxWidth: '100%', maxHeight: '70vh' }} />
        )}
      </DialogContent>
    </Dialog>
  );
}
