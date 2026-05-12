import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { roleLabels } from '../api';

const drawerWidth = 264;

const menu = [
  { to: '/', label: 'Дашборд', icon: <DashboardIcon /> },
  { to: '/board', label: 'Таск-менеджер', icon: <ViewKanbanIcon /> },
  { to: '/projects', label: 'Проекты', icon: <FolderIcon /> },
  { to: '/documents', label: 'Документы', icon: <DescriptionIcon /> },
  { to: '/users', label: 'Пользователи', icon: <PeopleIcon /> },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'rgba(255,255,255,0.88)',
          color: 'text.primary',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(226,232,240,0.86)',
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">АРХ-Контроль</Typography>
            <Typography variant="caption" color="text.secondary">Контроль архитектурных проектов</Typography>
          </Box>
          <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.25, py: 0.75, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontWeight: 800 }}>{user?.fullName?.[0]}</Avatar>
            <Box sx={{ minWidth: 180 }}>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>{user?.fullName}</Typography>
              <Typography variant="caption" color="text.secondary">{roleLabels[user?.role]}</Typography>
            </Box>
            <Button variant="text" color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>Выйти</Button>
          </Paper>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(226,232,240,0.86)',
            bgcolor: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(18px)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2.25 }}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Typography variant="overline" color="text.secondary">ООО МАКС-АРХ</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>Проектный офис</Typography>
          </Paper>
        </Box>
        <Divider />
        <List sx={{ px: 1.5, pt: 1.5 }}>
          {menu.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.to === '/'}
              sx={{
                borderRadius: 2,
                mb: 0.75,
                minHeight: 48,
                color: 'text.secondary',
                '& .MuiListItemIcon-root': { color: 'text.secondary', minWidth: 42 },
                '&.active': {
                  bgcolor: 'primary.main',
                  color: '#fff',
                  boxShadow: '0 10px 24px rgba(37, 99, 235, 0.22)',
                  '& .MuiListItemIcon-root': { color: '#fff' },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, pt: 12, maxWidth: 'calc(100vw - 264px)' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
