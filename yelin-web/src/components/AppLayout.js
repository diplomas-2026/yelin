import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
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
      <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, borderBottom: '1px solid #dfe3eb' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>АРХ-Контроль</Typography>
          <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' }}>{user?.fullName?.[0]}</Avatar>
          <Box sx={{ mr: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{user?.fullName}</Typography>
            <Typography variant="caption">{roleLabels[user?.role]}</Typography>
          </Box>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>Выйти</Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <Typography variant="overline" color="text.secondary">ООО МАКС-АРХ</Typography>
        </Box>
        <Divider />
        <List sx={{ px: 1 }}>
          {menu.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.to === '/'}
              sx={{ borderRadius: 2, mb: 0.5, '&.active': { bgcolor: 'primary.main', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' } } }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 11 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
