import { useEffect, useMemo, useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import StatusChip from '../components/StatusChip';

const cards = [
  ['projectsTotal', 'Всего проектов', AssignmentTurnedInIcon, '#1a73e8'],
  ['projectsInWork', 'В работе', AssignmentTurnedInIcon, '#f9ab00'],
  ['projectsReview', 'На проверке', ReportProblemIcon, '#1a73e8'],
  ['projectsRevision', 'На доработке', ReportProblemIcon, '#d93025'],
  ['projectsDone', 'Завершено', AssignmentTurnedInIcon, '#188038'],
  ['documentsTotal', 'Документов', DescriptionIcon, '#5f6368'],
  ['usersTotal', 'Пользователей', PeopleIcon, '#188038'],
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.dashboard().then(setData);
  }, []);

  const completion = useMemo(() => {
    if (!data?.projectsTotal) return 0;
    return Math.round((data.projectsDone / data.projectsTotal) * 100);
  }, [data]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Дашборд</Typography>
        <Typography color="text.secondary">Сводка контроля: статусы, документы, загрузка команды и ближайшие сроки</Typography>
      </Box>

      <Grid container spacing={2}>
        {cards.map(([field, label, Icon, color]) => (
          <Grid item xs={12} sm={6} md={3} key={field}>
            <Paper variant="outlined" sx={{ p: 2.5, height: '100%', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', right: -20, top: -20, width: 90, height: 90, borderRadius: '50%', bgcolor: `${color}12` }} />
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: `${color}18`, color, display: 'grid', placeItems: 'center' }}>
                  <Icon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">{label}</Typography>
                  <Typography variant="h4">{data?.[field] ?? '...'}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="h6">Проекты по статусам</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {(data?.projectsByStatus || []).map((item) => (
                <MetricBar key={item.label} label={item.label} value={item.value} total={data.projectsTotal} />
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="h6">Готовность портфеля</Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>{completion}%</Typography>
            <LinearProgress variant="determinate" value={completion} sx={{ mt: 1, height: 10, borderRadius: 1 }} />
            <Typography color="text.secondary" sx={{ mt: 2 }}>Доля завершенных проектов от общего числа в системе.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="h6">Типы объектов</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {(data?.projectsByObjectType || []).map((item) => (
                <MetricBar key={item.label} label={item.label} value={item.value} total={data.projectsTotal} />
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="h6">Ближайшие сроки</Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {(data?.nearestDeadlines || []).map((project) => (
                <Paper key={project.id} variant="outlined" onClick={() => navigate(`/projects/${project.id}`)} sx={{ p: 1.5, cursor: 'pointer', boxShadow: 'none', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-1px)' } }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight={700}>{project.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{project.managerName} · до {project.plannedFinishDate}</Typography>
                    </Box>
                    <StatusChip status={project.status} />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}

function MetricBar({ label, value, total }) {
  const percent = total ? Math.round((value / total) * 100) : 0;
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
        <Typography>{label}</Typography>
        <Typography fontWeight={700}>{value}</Typography>
      </Stack>
      <LinearProgress variant="determinate" value={percent} sx={{ height: 8, borderRadius: 1 }} />
    </Box>
  );
}
