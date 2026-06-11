/**
 * Barre supérieure — recherche, thème, profil
 */
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useThemeMode } from '@/contexts/ThemeModeContext';
import SearchDialog from '@/components/common/SearchDialog';
import { useFileManagerStore } from '@/store/fileManagerStore';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();
  const openFolder = useFileManagerStore((s) => s.openFolder);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  const initials = user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <>
      <AppBar position="sticky" color="default" elevation={0}>
        <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 } }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { md: 'none' } }}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />

          <Box
            onClick={() => setSearchOpen(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'action.hover',
              borderRadius: 3,
              px: 2,
              py: 0.5,
              maxWidth: 480,
              flex: 1,
              mx: { sm: 2 },
              cursor: 'pointer',
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder="Rechercher dans SUPFile"
              readOnly
              sx={{ flex: 1, fontSize: 14, pointerEvents: 'none' }}
            />
          </Box>

          <Tooltip title={mode === 'light' ? 'Mode sombre' : 'Mode clair'}>
            <IconButton onClick={toggleMode} color="inherit">
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar
              src={user?.avatar || undefined}
              sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 16 }}
            >
              {initials}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                navigate('/settings');
              }}
            >
              Paramètres
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Déconnexion
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenFolder={(folder) => {
          navigate('/files');
          openFolder(folder);
        }}
        onOpenFile={() => navigate('/files')}
      />
    </>
  );
}
