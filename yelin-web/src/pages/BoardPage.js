import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { api, projectStatuses } from '../api';
import StatusChip from '../components/StatusChip';

export default function BoardPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [draggedId, setDraggedId] = useState(null);

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

  async function drop(status) {
    if (!draggedId) return;
    await api.updateProjectStatus(draggedId, status);
    setDraggedId(null);
    load();
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4">Таск-менеджер проектов</Typography>
        <Typography color="text.secondary">Перетащите карточку, чтобы изменить статус проекта</Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(220px, 1fr))', gap: 2, overflowX: 'auto', pb: 1 }}>
        {projectStatuses.map((status) => (
          <Paper
            key={status}
            variant="outlined"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => drop(status)}
            sx={{ p: 1.5, minHeight: 560, bgcolor: '#f8fafc' }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={700}>{status}</Typography>
              <StatusChip status={status} />
            </Stack>
            <Stack spacing={1.25}>
              {grouped[status].map((project) => (
                <Paper
                  key={project.id}
                  draggable
                  onDragStart={() => setDraggedId(project.id)}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  elevation={0}
                  sx={{ p: 1.5, border: '1px solid #dfe3eb', cursor: 'grab', '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 16px rgba(26, 115, 232, 0.12)' } }}
                >
                  <Typography fontWeight={700}>{project.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{project.customer}</Typography>
                  <Typography variant="caption" color="text.secondary">Руководитель: {project.managerName}</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">Документов: {project.documentsCount}</Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
        ))}
      </Box>
    </Stack>
  );
}
