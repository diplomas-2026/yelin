import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1a73e8' },
    secondary: { main: '#188038' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    warning: { main: '#f9ab00' },
    error: { main: '#d93025' },
    success: { main: '#188038' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Google Sans", "Product Sans", "Segoe UI", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});
