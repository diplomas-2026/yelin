import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { api, roleLabels, roles } from '../api';

const emptyUser = {
  fullName: '',
  email: '',
  password: '',
  role: 'ENGINEER',
  positionTitle: '',
  phone: '',
  department: '',
  active: true,
};

export default function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(emptyUser);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      api.user(id).then((data) => setUser({ ...data, password: '' }));
    }
  }, [id, isEdit]);

  function update(field, value) {
    setUser((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    const saved = isEdit ? await api.updateUser(id, user) : await api.createUser(user);
    navigate(`/users/${saved.id}`);
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{isEdit ? 'Редактирование пользователя' : 'Создание пользователя'}</Typography>
      <Paper component="form" variant="outlined" onSubmit={submit} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
            <TextField label="ФИО" value={user.fullName} onChange={(event) => update('fullName', event.target.value)} required />
            <TextField label="Email" type="email" value={user.email} onChange={(event) => update('email', event.target.value)} required />
            <TextField label={isEdit ? 'Новый пароль' : 'Пароль'} type="password" value={user.password || ''} onChange={(event) => update('password', event.target.value)} required={!isEdit} />
            <FormControl>
              <InputLabel>Роль</InputLabel>
              <Select label="Роль" value={user.role} onChange={(event) => update('role', event.target.value)}>
                {roles.map((role) => <MenuItem key={role} value={role}>{roleLabels[role]}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Должность" value={user.positionTitle || ''} onChange={(event) => update('positionTitle', event.target.value)} required />
            <TextField label="Телефон" value={user.phone || ''} onChange={(event) => update('phone', event.target.value)} />
            <TextField label="Отдел" value={user.department || ''} onChange={(event) => update('department', event.target.value)} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Switch checked={Boolean(user.active)} onChange={(event) => update('active', event.target.checked)} />
              <Typography>Активен</Typography>
            </Box>
          </Box>
          <Box><Button type="submit" variant="contained" startIcon={<SaveIcon />}>Сохранить</Button></Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
