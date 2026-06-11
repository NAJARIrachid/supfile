import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from '@mui/material';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import BreadcrumbsNav from '@/components/layout/BreadcrumbsNav';
import { useFileManagerStore } from '@/store/fileManagerStore';

export default function FileManagerToolbar({ onCreateFolder }) {
  const { viewMode, setViewMode, breadcrumbs, navigateToBreadcrumb } = useFileManagerStore();

  const breadcrumbItems = breadcrumbs.map((c, i) => ({
    label: c.label,
    onClick: i < breadcrumbs.length - 1 ? () => navigateToBreadcrumb(i) : undefined,
  }));

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ sm: 'center' }}
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <BreadcrumbsNav items={breadcrumbItems} />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<CreateNewFolderOutlinedIcon />}
          onClick={onCreateFolder}
        >
          Nouveau dossier
        </Button>
        <ToggleButtonGroup
          size="small"
          value={viewMode}
          exclusive
          onChange={(_, v) => v && setViewMode(v)}
        >
          <ToggleButton value="grid">
            <GridViewIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="list">
            <ViewListIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Stack>
  );
}
