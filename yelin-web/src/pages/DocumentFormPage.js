import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { api, documentStatuses } from '../api';

const emptyDocument = {
  projectId: '',
  name: '',
  type: 'АР',
  fileName: '',
  version: 1,
  status: 'В работе',
  uploadedBy: '',
  comment: '',
};

export default function DocumentFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState({ ...emptyDocument, projectId: searchParams.get('projectId') || '' });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const isEdit = Boolean(id);

  useEffect(() => {
    api.projects().then(setProjects);
    api.users().then(setUsers);
    if (isEdit) {
      api.document(id).then(setDocument);
    }
  }, [id, isEdit]);

  const selectedProject = useMemo(() => projects.find((project) => project.id === Number(document.projectId)), [projects, document.projectId]);
  const uploaders = useMemo(() => {
    if (!selectedProject) return users.filter((user) => user.role !== 'ADMIN');
    const ids = new Set([selectedProject.managerId, ...selectedProject.engineers.map((engineer) => engineer.id)]);
    return users.filter((user) => ids.has(user.id));
  }, [users, selectedProject]);

  function update(field, value) {
    setDocument((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    const payload = {
      ...document,
      projectId: Number(document.projectId),
      version: Number(document.version),
      uploadedBy: Number(document.uploadedBy),
    };
    const saved = isEdit ? await api.updateDocument(id, payload) : await api.createDocument(payload);
    navigate(`/projects/${saved.projectId}`);
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{isEdit ? 'Редактирование документа' : 'Добавление документа'}</Typography>
      <Paper component="form" variant="outlined" onSubmit={submit} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
            <FormControl required>
              <InputLabel>Проект</InputLabel>
              <Select label="Проект" value={document.projectId || ''} onChange={(event) => update('projectId', event.target.value)}>
                {projects.map((project) => <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Название" value={document.name} onChange={(event) => update('name', event.target.value)} required />
            <TextField label="Тип" value={document.type} onChange={(event) => update('type', event.target.value)} required />
            <TextField label="Имя файла" value={document.fileName} onChange={(event) => update('fileName', event.target.value)} required />
            <TextField label="Версия" type="number" value={document.version} onChange={(event) => update('version', event.target.value)} required />
            <FormControl>
              <InputLabel>Статус</InputLabel>
              <Select label="Статус" value={document.status} onChange={(event) => update('status', event.target.value)}>
                {documentStatuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl required>
              <InputLabel>Загрузил</InputLabel>
              <Select label="Загрузил" value={document.uploadedBy || ''} onChange={(event) => update('uploadedBy', event.target.value)}>
                {uploaders.map((user) => <MenuItem key={user.id} value={user.id}>{user.fullName}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <TextField label="Комментарий" value={document.comment || ''} onChange={(event) => update('comment', event.target.value)} multiline rows={3} />
          <Box><Button type="submit" variant="contained" startIcon={<SaveIcon />}>Сохранить</Button></Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
