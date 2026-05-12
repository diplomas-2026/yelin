import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Chip, Paper, Stack, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { api, projectStatuses } from '../api';
import StatusChip from '../components/StatusChip';
import { useAuth } from '../context/AuthContext';

const statusHints = {
  Новый: 'Создан, ожидает запуска',
  'В работе': 'Инженеры могут выполнять проект',
  'На проверке': 'Руководитель проверяет результат',
  'На доработке': 'Инженеры исправляют замечания',
  Завершен: 'Проект принят руководителем',
};

export default function BoardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [draggedProject, setDraggedProject] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    setProjects(await api.projects());
  }

  useEffect(() => { load(); }, []);

  const grouped = useMemo(() => {
    return projectStatuses.reduce((acc, status) => {
      acc[status] = projects.filter((project) => project.status === status);
      return acc;
    }, {});
  }, [projects]);

  function canMove(project, targetStatus) {
    if (!project || project.status === targetStatus) return false;
    if (user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER') return true;
    return user.role === 'ENGINEER'
      && ['В работе', 'На доработке'].includes(project.status)
      && targetStatus === 'На проверке';
  }

  async function drop(status) {
    if (!draggedProject) return;
    if (!canMove(draggedProject, status)) {
      setError('Для вашей роли этот переход статуса недоступен.');
      return;
    }
    await api.updateProjectStatus(draggedProject.id, status);
    setDraggedProject(null);
    setError('');
    load();
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4">Таск-менеджер проектов</Typography>
        <Typography color="text.secondary">Доступные колонки подсвечиваются во время перетаскивания карточки</Typography>
      </Box>
      {error && <Alert severity="warning" onClose={() => setError('')}>{error}</Alert>}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))', gap: 2, overflowX: 'auto', pb: 1 }}>
        {projectStatuses.map((status) => {
          const available = draggedProject ? canMove(draggedProject, status) : true;
          return (
            <Paper
              key={status}
              variant="outlined"
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => drop(status)}
              sx={{
                p: 1.5,
                minHeight: 590,
                bgcolor: draggedProject && available ? '#e8f0fe' : '#f8fafc',
                borderColor: draggedProject && available ? 'primary.main' : '#dfe3eb',
                opacity: draggedProject && !available ? 0.62 : 1,
              }}
            >
              <Stack spacing={1.25} sx={{ mb: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight={700}>{status}</Typography>
                  {available ? <LockOpenIcon color="success" fontSize="small" /> : <LockIcon color="disabled" fontSize="small" />}
                </Stack>
                <Typography variant="caption" color="text.secondary">{statusHints[status]}</Typography>
                <Chip size="small" label={`${grouped[status].length} карточек`} sx={{ alignSelf: 'flex-start' }} />
              </Stack>
              <Stack spacing={1.25}>
                {grouped[status].map((project) => (
                  <Paper
                    key={project.id}
                    draggable
                    onDragStart={() => setDraggedProject(project)}
                    onDragEnd={() => setDraggedProject(null)}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      border: '1px solid #dfe3eb',
                      cursor: 'grab',
                      bgcolor: '#fff',
                      '&:hover': { borderColor: 'primary.main', boxShadow: '0 6px 18px rgba(26, 115, 232, 0.14)' },
                    }}
                  >
                    <Stack spacing={1}>
                      <StatusChip status={project.status} />
                      <Typography fontWeight={700}>{project.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{project.customer}</Typography>
                      <Typography variant="caption" color="text.secondary">Руководитель: {project.managerName}</Typography>
                      <Typography variant="caption" color="text.secondary">Инженеров: {project.engineers.length} · документов: {project.documentsCount}</Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Stack>
  );
}
