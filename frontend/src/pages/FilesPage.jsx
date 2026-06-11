import { useEffect } from 'react';
import FileExplorer from '@/components/fileManager/FileExplorer';
import { useFileManagerStore } from '@/store/fileManagerStore';

export default function FilesPage() {
  const resetToRoot = useFileManagerStore((s) => s.resetToRoot);

  useEffect(() => {
    resetToRoot();
  }, [resetToRoot]);

  return <FileExplorer />;
}
