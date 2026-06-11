/**
 * Thème MUI — palette inspirée Google Drive (bleu #1a73e8)
 */
import { createTheme } from '@mui/material/styles';

const brand = {
  primary: '#1a73e8',
  primaryDark: '#1557b0',
  secondary: '#5f6368',
};

export function buildTheme(mode = 'light') {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: brand.primary,
        dark: brand.primaryDark,
      },
      secondary: {
        main: brand.secondary,
      },
      background: {
        default: isLight ? '#f8f9fa' : '#121212',
        paper: isLight ? '#ffffff' : '#1e1e1e',
      },
      divider: isLight ? '#e8eaed' : '#3c4043',
    },
    typography: {
      fontFamily: '"Roboto", "Google Sans", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 500 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 24,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: '1px solid',
            borderColor: isLight ? '#e8eaed' : '#3c4043',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: '1px solid',
            borderColor: isLight ? '#e8eaed' : '#3c4043',
          },
        },
      },
    },
  });
}
