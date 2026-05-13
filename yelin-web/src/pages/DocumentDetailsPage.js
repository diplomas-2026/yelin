import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Divider, Link, Paper, Stack, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../api';

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.document(id).then(setDocument).catch((exception) => setError(exception.message));
  }, [id]);

  async function download() {
    const file = await api.downloadDocument(id);
    const url = URL.createObjectURL(file.blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = file.fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function removeDocument() {
    const confirmed = window.confirm('Удалить документ?');
    if (!confirmed) return;
    await api.deleteDocument(id);
    navigate(`/projects/${document.projectId}`);
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!document) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">{document.name}</Typography>
          <Typography color="text.secondary">
            <Link component={RouterLink} to={`/projects/${document.projectId}`}>{document.projectName}</Link>
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={download}>Скачать</Button>
        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={removeDocument}>
          Удалить
        </Button>
        <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/documents/${id}/edit`)}>Редактировать</Button>
      </Box>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6">Информация о документе</Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { md: 'repeat(2, 1fr)' }, gap: 2 }}>
          <Info label="Файл" value={document.fileName} />
          <Info label="Тип" value={document.type} />
          <Info label="Загрузил" value={document.uploadedByName} />
          <Info label="Дата загрузки" value={document.uploadedAt} />
          <Info label="Комментарий" value={document.comment} />
          <Info label="MIME type" value={document.mimeType} />
        </Box>
      </Paper>
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
