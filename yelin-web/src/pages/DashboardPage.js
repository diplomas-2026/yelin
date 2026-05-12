import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { api } from '../api';

const cards = [
  ['projectsTotal', 'Всего проектов'],
  ['projectsInWork', 'В работе'],
  ['projectsReview', 'На проверке'],
  ['projectsRevision', 'На доработке'],
  ['projectsDone', 'Завершено'],
  ['documentsTotal', 'Документов'],
  ['usersTotal', 'Пользователей'],
];

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.dashboard().then(setData);
  }, []);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Дашборд</Typography>
        <Typography color="text.secondary">Сводка по проектам, документам и участникам</Typography>
      </Box>
      <Grid container spacing={2}>
        {cards.map(([field, label]) => (
          <Grid item xs={12} sm={6} md={3} key={field}>
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Typography variant="body2" color="text.secondary">{label}</Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>{data?.[field] ?? '...'}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
