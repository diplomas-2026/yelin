import { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function ProjectChat({ projectId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const lastId = useRef(null);

  const loadMessages = useCallback(async () => {
    const data = await api.chatMessages(projectId);
    setMessages(data);
    lastId.current = data.at(-1)?.id || null;
  }, [projectId]);

  useEffect(() => {
    loadMessages();
    const timer = setInterval(async () => {
      const last = await api.lastChatMessage(projectId);
      if ((last?.id || null) !== lastId.current) {
        loadMessages();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [projectId, loadMessages]);

  async function submit(event) {
    event.preventDefault();
    if (!message.trim()) return;
    await api.sendChatMessage(projectId, message);
    setMessage('');
    loadMessages();
  }

  return (
    <Paper variant="outlined" sx={{ p: 0, height: 540, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, py: 2, bgcolor: 'rgba(248,250,252,0.8)' }}>
        <Typography variant="h6">Чат проекта</Typography>
        <Typography variant="body2" color="text.secondary">Сообщения участников проекта обновляются автоматически</Typography>
      </Box>
      <Divider />
      <Stack spacing={1.5} sx={{ flexGrow: 1, overflow: 'auto', p: 2.5 }}>
        {messages.map((item) => {
          const mine = item.userId === user.id;
          return (
            <Box key={item.id} sx={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
              <Box sx={{ display: 'flex', gap: 1, maxWidth: '78%', flexDirection: mine ? 'row-reverse' : 'row' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: mine ? 'primary.main' : 'secondary.main' }}>{item.authorName[0]}</Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">{item.authorName}</Typography>
                  <Box sx={{ px: 1.5, py: 1, borderRadius: 2, bgcolor: mine ? 'primary.main' : '#f1f5f9', color: mine ? '#fff' : 'text.primary', boxShadow: mine ? '0 8px 18px rgba(37, 99, 235, 0.18)' : 'none' }}>
                    <Typography variant="body2">{item.message}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Stack>
      <Box component="form" onSubmit={submit} sx={{ display: 'flex', gap: 1, p: 2, bgcolor: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <TextField size="small" fullWidth placeholder="Написать сообщение" value={message} onChange={(event) => setMessage(event.target.value)} />
        <Button type="submit" variant="contained" endIcon={<SendIcon />}>Отправить</Button>
      </Box>
    </Paper>
  );
}
