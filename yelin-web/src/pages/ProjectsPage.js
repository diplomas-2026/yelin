import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { api } from '../api';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  async function load() {
    setProjects(await api.projects());
  }

  useEffect(() => { load(); }, []);

  async function removeProject(event, id) {
    event.stopPropagation();
    if (window.confirm('Удалить проект?')) {
      await api.deleteProject(id);
      load();
    }
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Проекты</Typography>
          <Typography color="text.secondary">Нажмите на строку, чтобы открыть карточку проекта</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/projects/new')}>Создать проект</Button>
      </Box>
      <DataTable
        title="Реестр проектов"
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
          {
            field: 'actions',
            headerName: 'Действия',
            render: (row) => (
              <>
                <Tooltip title="Редактировать"><IconButton onClick={(event) => { event.stopPropagation(); navigate(`/projects/${row.id}/edit`); }}><EditIcon /></IconButton></Tooltip>
                <Tooltip title="Удалить"><IconButton onClick={(event) => removeProject(event, row.id)}><DeleteIcon /></IconButton></Tooltip>
              </>
            ),
          },
        ]}
      />
    </Stack>
  );
}
