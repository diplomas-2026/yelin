import { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
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
    <Paper variant="outlined" sx={{ p: 2, height: 520, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Чат проекта</Typography>
      <Stack spacing={1.5} sx={{ flexGrow: 1, overflow: 'auto', pr: 1 }}>
        {messages.map((item) => {
          const mine = item.userId === user.id;
          return (
            <Box key={item.id} sx={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
              <Box sx={{ display: 'flex', gap: 1, maxWidth: '78%', flexDirection: mine ? 'row-reverse' : 'row' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: mine ? 'primary.main' : 'secondary.main' }}>{item.authorName[0]}</Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">{item.authorName}</Typography>
                  <Box sx={{ px: 1.5, py: 1, borderRadius: 2, bgcolor: mine ? 'primary.main' : '#eef2f7', color: mine ? '#fff' : 'text.primary' }}>
                    <Typography variant="body2">{item.message}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Stack>
      <Box component="form" onSubmit={submit} sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <TextField size="small" fullWidth placeholder="Написать сообщение" value={message} onChange={(event) => setMessage(event.target.value)} />
        <Button type="submit" variant="contained" endIcon={<SendIcon />}>Отправить</Button>
      </Box>
    </Paper>
  );
}
