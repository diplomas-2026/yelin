import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Button, Divider, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { api, roleLabels } from '../api';
import DataTable from '../components/DataTable';
import ProjectChat from '../components/ProjectChat';
import StatusChip from '../components/StatusChip';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);

  const load = useCallback(async () => {
    setProject(await api.project(id));
    setDocuments(await api.documents(id));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function downloadDocument(event, documentId) {
    event.stopPropagation();
    const file = await api.downloadDocument(documentId);
    const url = URL.createObjectURL(file.blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = file.fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!project) return <Typography>Загрузка...</Typography>;

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">{project.name}</Typography>
          <Typography color="text.secondary">{project.customer}</Typography>
        </Box>
        <StatusChip status={project.status} />
        {(currentUser?.role === 'ADMIN' || currentUser?.id === project.managerId) && (
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/projects/${id}/edit`)}>
            Редактировать
          </Button>
        )}
      </Box>
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography variant="h6">Информация</Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr 1fr' }, gap: 2 }}>
          <Info label="Описание" value={project.description} />
          <Info label="Адрес" value={project.address} />
          <Info label="Тип объекта" value={project.objectType} />
          <Info label="Дата старта" value={project.startDate} />
          <Info label="Плановое завершение" value={project.plannedFinishDate} />
          <Info label="Фактическое завершение" value={project.actualFinishDate} />
        </Box>
      </Paper>
      <Box>
        <Typography variant="h5" sx={{ mb: 1.5 }}>Участники</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
          <MemberCard user={{ id: project.managerId, fullName: project.managerName, role: 'PROJECT_MANAGER', positionTitle: 'Руководитель проекта' }} />
          {project.engineers.map((engineer) => <MemberCard key={engineer.id} user={engineer} />)}
        </Box>
      </Box>
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
          { field: 'uploadedByName', headerName: 'Загрузил' },
          {
            field: 'download',
            headerName: 'Скачать',
            render: (row) => (
              <Tooltip title="Скачать файл">
                <IconButton onClick={(event) => downloadDocument(event, row.id)}><DownloadIcon /></IconButton>
              </Tooltip>
            ),
          },
        ]}
      />
      <ProjectChat projectId={id} />
    </Stack>
  );
}

function MemberCard({ user }) {
  const navigate = useNavigate();

  return (
    <Paper
      variant="outlined"
      onClick={() => navigate(`/users/${user.id}`)}
      sx={{
        p: 2,
        display: 'flex',
        gap: 1.5,
        alignItems: 'center',
        boxShadow: 'none',
        cursor: 'pointer',
        transition: 'transform 160ms ease, border-color 160ms ease',
        '&:hover': { transform: 'translateY(-2px)', borderColor: 'primary.main' },
      }}
    >
      <Avatar sx={{ width: 44, height: 44, bgcolor: user.role === 'PROJECT_MANAGER' ? 'primary.main' : 'secondary.main', fontWeight: 800 }}>{user.fullName[0]}</Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700 }}>{user.fullName}</Typography>
        <Typography variant="body2" color="text.secondary">{roleLabels[user.role] || user.positionTitle}</Typography>
        <Typography variant="caption" color="text.secondary">{user.positionTitle || 'Участник проекта'}</Typography>
      </Box>
    </Paper>
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
