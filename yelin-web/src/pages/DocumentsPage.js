import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { api } from '../api';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';

export default function DocumentsPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);

  async function load() {
    setDocuments(await api.documents());
  }

  useEffect(() => { load(); }, []);

  async function removeDocument(event, id) {
    event.stopPropagation();
    if (window.confirm('Удалить документ?')) {
      await api.deleteDocument(id);
      load();
    }
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Документы</Typography>
          <Typography color="text.secondary">Реестр проектной документации</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/documents/new')}>Добавить</Button>
      </Box>
      <DataTable
        title="Список документов"
        rows={documents}
        filterField="status"
        filterLabel="Статус"
        onRowClick={(row) => navigate(`/documents/${row.id}/edit`)}
        columns={[
          { field: 'name', headerName: 'Название' },
          { field: 'projectName', headerName: 'Проект' },
          { field: 'type', headerName: 'Тип' },
          { field: 'fileName', headerName: 'Файл' },
          { field: 'version', headerName: 'Версия' },
          { field: 'status', headerName: 'Статус', render: (row) => <StatusChip status={row.status} /> },
          { field: 'uploadedByName', headerName: 'Загрузил' },
          {
            field: 'actions',
            headerName: 'Действия',
            render: (row) => (
              <>
                <Tooltip title="Редактировать"><IconButton onClick={(event) => { event.stopPropagation(); navigate(`/documents/${row.id}/edit`); }}><EditIcon /></IconButton></Tooltip>
                <Tooltip title="Удалить"><IconButton onClick={(event) => removeDocument(event, row.id)}><DeleteIcon /></IconButton></Tooltip>
              </>
            ),
          },
        ]}
      />
    </Stack>
  );
}
