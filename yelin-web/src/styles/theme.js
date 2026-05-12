import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#2563eb', dark: '#174ea6', light: '#dbeafe' },
    secondary: { main: '#0f766e', light: '#ccfbf1' },
    background: { default: '#f6f8fc', paper: '#ffffff' },
    text: { primary: '#172033', secondary: '#64748b' },
    divider: '#e2e8f0',
    warning: { main: '#d97706', light: '#fef3c7' },
    error: { main: '#dc2626', light: '#fee2e2' },
    success: { main: '#15803d', light: '#dcfce7' },
    info: { main: '#0284c7', light: '#e0f2fe' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Google Sans", "Product Sans", "Segoe UI", sans-serif',
    h4: { fontWeight: 800, letterSpacing: 0 },
    h5: { fontWeight: 800, letterSpacing: 0 },
    h6: { fontWeight: 800, letterSpacing: 0 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, boxShadow: 'none' },
        contained: { boxShadow: '0 8px 20px rgba(37, 99, 235, 0.18)' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderColor: '#e2e8f0',
          boxShadow: '0 14px 42px rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: '#fff' },
        notchedOutline: { borderColor: '#dbe3ef' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#64748b',
          fontSize: 12,
          fontWeight: 800,
          textTransform: 'uppercase',
          backgroundColor: '#f8fafc',
        },
      },
    },
  },
});
