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
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #e8f0fe, #f8fafc 45%, #e6f4ea)' }}>
      <Paper component="form" onSubmit={submit} elevation={4} sx={{ width: 420, p: 4 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h4">АРХ-Контроль</Typography>
            <Typography color="text.secondary">Вход в систему контроля архитектурных проектов</Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth />
          <TextField label="Пароль" type="password" value={password} onChange={(event) => setPassword(event.target.value)} fullWidth />
          <Button type="submit" size="large" variant="contained" startIcon={<LoginIcon />}>Войти</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
