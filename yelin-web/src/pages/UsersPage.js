import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { api, roleLabels } from '../api';
import DataTable from '../components/DataTable';

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  async function load() {
    setUsers(await api.users());
  }

  useEffect(() => { load(); }, []);

  async function removeUser(event, id) {
    event.stopPropagation();
    if (window.confirm('Удалить пользователя?')) {
      await api.deleteUser(id);
      load();
    }
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Пользователи</Typography>
          <Typography color="text.secondary">Администратор управляет ролями и доступом</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/users/new')}>Добавить</Button>
      </Box>
      <DataTable
        title="Список пользователей"
        rows={users}
        filterField="role"
        filterLabel="Роль"
        onRowClick={(row) => navigate(`/users/${row.id}`)}
        columns={[
          { field: 'fullName', headerName: 'ФИО' },
          { field: 'email', headerName: 'Email' },
          { field: 'role', headerName: 'Роль', render: (row) => roleLabels[row.role] },
          { field: 'positionTitle', headerName: 'Должность' },
          { field: 'department', headerName: 'Отдел' },
          {
            field: 'actions',
            headerName: 'Действия',
            render: (row) => (
              <>
                <Tooltip title="Редактировать"><IconButton onClick={(event) => { event.stopPropagation(); navigate(`/users/${row.id}/edit`); }}><EditIcon /></IconButton></Tooltip>
                <Tooltip title="Удалить"><IconButton onClick={(event) => removeUser(event, row.id)}><DeleteIcon /></IconButton></Tooltip>
              </>
            ),
          },
        ]}
      />
    </Stack>
  );
}
