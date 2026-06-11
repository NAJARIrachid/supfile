/**
 * Navigation latérale — style Google Drive
 */
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: 'Mes fichiers', path: '/files', icon: FolderOutlinedIcon },
  { label: 'Partagés avec moi', path: '/shared', icon: PeopleOutlineIcon },
  { label: 'Corbeille', path: '/trash', icon: DeleteOutlineIcon },
  { label: 'Dashboard', path: '/dashboard', icon: DashboardOutlinedIcon },
  { label: 'Paramètres', path: '/settings', icon: SettingsOutlinedIcon },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2, gap: 1 }}>
        <CloudOutlinedIcon color="primary" />
        <Typography variant="h6" color="primary" fontWeight={700}>
          SUPFile
        </Typography>
      </Toolbar>

      <List sx={{ px: 1, flex: 1 }}>
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path || location.pathname.startsWith(`${path}/`);
          return (
            <ListItemButton
              key={path}
              selected={active}
              onClick={() => {
                navigate(path);
                if (isMobile) onMobileClose?.();
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon color={active ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export { DRAWER_WIDTH };
