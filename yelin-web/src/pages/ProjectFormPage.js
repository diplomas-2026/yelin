import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { api, projectStatuses } from '../api';

const emptyProject = {
  name: '',
  description: '',
  customer: '',
  address: '',
  objectType: 'Жилое здание',
  status: 'Новый',
  managerId: '',
  engineerIds: [],
  startDate: '',
  plannedFinishDate: '',
  actualFinishDate: '',
};

export default function ProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(emptyProject);
  const [users, setUsers] = useState([]);
  const isEdit = Boolean(id);

  useEffect(() => {
    api.users().then(setUsers);
    if (isEdit) {
      api.project(id).then((data) => setProject({
        ...data,
        engineerIds: data.engineers.map((engineer) => engineer.id),
        startDate: data.startDate || '',
        plannedFinishDate: data.plannedFinishDate || '',
        actualFinishDate: data.actualFinishDate || '',
      }));
    }
  }, [id, isEdit]);

  function update(field, value) {
    setProject((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    const payload = {
      ...project,
      managerId: Number(project.managerId),
      engineerIds: project.engineerIds.map(Number),
      startDate: project.startDate || null,
      plannedFinishDate: project.plannedFinishDate || null,
      actualFinishDate: project.actualFinishDate || null,
    };
    const saved = isEdit ? await api.updateProject(id, payload) : await api.createProject(payload);
    navigate(`/projects/${saved.id}`);
  }

  const managers = users.filter((user) => user.role === 'PROJECT_MANAGER');
  const engineers = users.filter((user) => user.role === 'ENGINEER');

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{isEdit ? 'Редактирование проекта' : 'Создание проекта'}</Typography>
      <Paper component="form" variant="outlined" onSubmit={submit} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField label="Название" value={project.name} onChange={(event) => update('name', event.target.value)} required />
          <TextField label="Описание" value={project.description || ''} onChange={(event) => update('description', event.target.value)} multiline rows={3} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
            <TextField label="Заказчик" value={project.customer} onChange={(event) => update('customer', event.target.value)} required />
            <TextField label="Адрес" value={project.address || ''} onChange={(event) => update('address', event.target.value)} />
            <TextField label="Тип объекта" value={project.objectType} onChange={(event) => update('objectType', event.target.value)} required />
            <FormControl>
              <InputLabel>Статус</InputLabel>
              <Select label="Статус" value={project.status} onChange={(event) => update('status', event.target.value)}>
                {projectStatuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl required>
              <InputLabel>Руководитель</InputLabel>
              <Select label="Руководитель" value={project.managerId || ''} onChange={(event) => update('managerId', event.target.value)}>
                {managers.map((user) => <MenuItem key={user.id} value={user.id}>{user.fullName}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Инженеры</InputLabel>
              <Select
                multiple
                label="Инженеры"
                value={project.engineerIds}
                input={<OutlinedInput label="Инженеры" />}
                onChange={(event) => update('engineerIds', event.target.value)}
                renderValue={(selected) => selected.map((value) => engineers.find((user) => user.id === value)?.fullName).join(', ')}
              >
                {engineers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Checkbox checked={project.engineerIds.includes(user.id)} />
                    <ListItemText primary={user.fullName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Дата старта" type="date" value={project.startDate} onChange={(event) => update('startDate', event.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField label="Плановое завершение" type="date" value={project.plannedFinishDate} onChange={(event) => update('plannedFinishDate', event.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField label="Фактическое завершение" type="date" value={project.actualFinishDate} onChange={(event) => update('actualFinishDate', event.target.value)} InputLabelProps={{ shrink: true }} />
          </Box>
          <Box sx={{ pt: 1 }}>
            <Button type="submit" variant="contained" startIcon={<SaveIcon />} sx={{ height: 44 }}>Сохранить</Button>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
