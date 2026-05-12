import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import { api } from '../api';

const emptyDocument = {
  projectId: '',
  comment: '',
};

function deriveMeta(fileName) {
  const clean = fileName.trim();
  const baseName = clean.split('/').pop().split('\\').pop();
  const dotIndex = baseName.lastIndexOf('.');
  const name = dotIndex > 0 ? baseName.slice(0, dotIndex) : baseName;
  const type = dotIndex > 0 ? baseName.slice(dotIndex + 1).toUpperCase() : 'FILE';
  return {
    fileName: baseName,
    name: name.replaceAll('_', ' '),
    type,
  };
}

export default function DocumentFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState({ ...emptyDocument, projectId: searchParams.get('projectId') || '' });
  const [projects, setProjects] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [error, setError] = useState('');
  const isEdit = Boolean(id);

  useEffect(() => {
    api.projects().then(setProjects);
    if (isEdit) {
      api.document(id).then((data) => {
        setCurrentDocument(data);
        setDocument({
          projectId: data.projectId,
          comment: data.comment || '',
        });
      });
    }
  }, [id, isEdit]);

  function update(field, value) {
    setDocument((current) => ({ ...current, [field]: value }));
  }

  function onFileChange(event) {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  }

  const preview = useMemo(() => {
    if (selectedFile) {
      return deriveMeta(selectedFile.name);
    }
    if (currentDocument) {
      return {
        fileName: currentDocument.fileName,
        name: currentDocument.name,
        type: currentDocument.type,
      };
    }
    return null;
  }, [selectedFile, currentDocument]);

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      formData.append('projectId', String(document.projectId));
      formData.append('comment', document.comment || '');
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      if (!isEdit && !selectedFile) {
        throw new Error('Файл обязателен');
      }
      const saved = isEdit
        ? await api.updateDocument(id, formData)
        : await api.createDocument(formData);
      navigate(`/projects/${saved.projectId}`);
    } catch (exception) {
      setError(exception.message);
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{isEdit ? 'Редактирование документа' : 'Добавление документа'}</Typography>
      <Paper component="form" variant="outlined" onSubmit={submit} sx={{ p: 3 }}>
        <Stack spacing={2.25}>
          {error && <Alert severity="error">{error}</Alert>}
          <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
            <FormControl required>
              <InputLabel>Проект</InputLabel>
              <Select label="Проект" value={document.projectId || ''} onChange={(event) => update('projectId', event.target.value)}>
                {projects.map((project) => <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>)}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{ height: 56, justifyContent: 'flex-start' }}
            >
              {selectedFile ? selectedFile.name : 'Выбрать файл'}
              <input hidden type="file" onChange={onFileChange} />
            </Button>
          </Box>

          {preview && (
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc', boxShadow: 'none' }}>
              <Typography variant="caption" color="text.secondary">Определено автоматически</Typography>
              <Typography variant="h6" sx={{ mt: 0.5 }}>{preview.name}</Typography>
              <Typography variant="body2" color="text.secondary">Файл: {preview.fileName} · Тип: {preview.type}</Typography>
            </Paper>
          )}

          {isEdit && !selectedFile && (
            <Alert severity="info">Если не выбрать новый файл, будет сохранен текущий.</Alert>
          )}

          <TextField label="Комментарий" value={document.comment || ''} onChange={(event) => update('comment', event.target.value)} multiline rows={4} />
          <Box sx={{ pt: 1 }}>
            <Button type="submit" variant="contained" startIcon={<SaveIcon />} sx={{ height: 44 }}>
              Сохранить
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
