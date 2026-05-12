import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Divider, Link, Paper, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { api } from '../api';
import DataTable from '../components/DataTable';
import ProjectChat from '../components/ProjectChat';
import StatusChip from '../components/StatusChip';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);

  const load = useCallback(async () => {
    setProject(await api.project(id));
    setDocuments(await api.documents(id));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (!project) return <Typography>Загрузка...</Typography>;

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">{project.name}</Typography>
          <Typography color="text.secondary">{project.customer}</Typography>
        </Box>
        <StatusChip status={project.status} />
        <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/projects/${id}/edit`)}>Редактировать</Button>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { lg: '1fr 420px' }, gap: 2 }}>
        <Stack spacing={2}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="h6">Информация</Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
              <Info label="Описание" value={project.description} />
              <Info label="Адрес" value={project.address} />
              <Info label="Тип объекта" value={project.objectType} />
              <Info label="Плановое завершение" value={project.plannedFinishDate} />
            </Box>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="h6">Участники</Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Typography>
                Руководитель: <Link component={RouterLink} to={`/users/${project.managerId}`}>{project.managerName}</Link>
              </Typography>
              {project.engineers.map((engineer) => (
                <Typography key={engineer.id}>
                  Инженер: <Link component={RouterLink} to={`/users/${engineer.id}`}>{engineer.fullName}</Link>
                </Typography>
              ))}
            </Stack>
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Документы проекта</Typography>
            <Button startIcon={<AddIcon />} variant="contained" onClick={() => navigate(`/documents/new?projectId=${id}`)}>Добавить документ</Button>
          </Box>
          <DataTable
            title="Документы"
            rows={documents}
            filterField="status"
            filterLabel="Статус"
            onRowClick={(row) => navigate(`/documents/${row.id}/edit`)}
            columns={[
              { field: 'name', headerName: 'Название' },
              { field: 'type', headerName: 'Тип' },
              { field: 'fileName', headerName: 'Файл' },
              { field: 'version', headerName: 'Версия' },
              { field: 'status', headerName: 'Статус', render: (row) => <StatusChip status={row.status} /> },
              { field: 'uploadedByName', headerName: 'Загрузил' },
            ]}
          />
        </Stack>
        <ProjectChat projectId={id} />
      </Box>
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
