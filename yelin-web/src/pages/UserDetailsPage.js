import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { api, roleLabels } from '../api';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';

export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.user(id).then(setUser);
    api.userProjects(id).then(setProjects);
  }, [id]);

  if (!user) return <Typography>Загрузка...</Typography>;

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">{user.fullName}</Typography>
          <Typography color="text.secondary">{roleLabels[user.role]}</Typography>
        </Box>
        <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/users/${id}/edit`)}>Редактировать</Button>
      </Box>
      <Paper variant="outlined" sx={{ p: 3, display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
        <Info label="Email" value={user.email} />
        <Info label="Должность" value={user.positionTitle} />
        <Info label="Телефон" value={user.phone} />
        <Info label="Отдел" value={user.department} />
        <Info label="Статус" value={user.active ? 'Активен' : 'Отключен'} />
      </Paper>
      <DataTable
        title="Проекты пользователя"
        rows={projects}
        filterField="status"
        filterLabel="Статус"
        onRowClick={(row) => navigate(`/projects/${row.id}`)}
        columns={[
          { field: 'name', headerName: 'Проект' },
          { field: 'customer', headerName: 'Заказчик' },
          { field: 'objectType', headerName: 'Тип объекта' },
          { field: 'managerName', headerName: 'Руководитель' },
          { field: 'status', headerName: 'Статус', render: (row) => <StatusChip status={row.status} /> },
          { field: 'documentsCount', headerName: 'Документы' },
        ]}
      />
    </Stack>
  );
}

function Info({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography>{value || 'Не указано'}</Typography>
    </Box>
  );
}
