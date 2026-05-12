import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@max-arh.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2 }}>
      <Paper component="form" onSubmit={submit} elevation={0} sx={{ width: 440, p: 4, border: '1px solid #e2e8f0' }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h4">АРХ-Контроль</Typography>
            <Typography color="text.secondary">Вход в систему контроля архитектурных проектов</Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth />
          <TextField label="Пароль" type="password" value={password} onChange={(event) => setPassword(event.target.value)} fullWidth />
          <Button type="submit" size="large" variant="contained" startIcon={<LoginIcon />} sx={{ height: 48 }}>Войти</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
