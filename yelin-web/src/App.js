import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import BoardPage from './pages/BoardPage';
import DashboardPage from './pages/DashboardPage';
import DocumentFormPage from './pages/DocumentFormPage';
import DocumentsPage from './pages/DocumentsPage';
import LoginPage from './pages/LoginPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectFormPage from './pages/ProjectFormPage';
import ProjectsPage from './pages/ProjectsPage';
import UserDetailsPage from './pages/UserDetailsPage';
import UserFormPage from './pages/UserFormPage';
import UsersPage from './pages/UsersPage';
import { theme } from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={(
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              )}
            >
              <Route index element={<DashboardPage />} />
              <Route path="board" element={<BoardPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/new" element={<ProjectFormPage />} />
              <Route path="projects/:id" element={<ProjectDetailsPage />} />
              <Route path="projects/:id/edit" element={<ProjectFormPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="documents/new" element={<DocumentFormPage />} />
              <Route path="documents/:id/edit" element={<DocumentFormPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/new" element={<UserFormPage />} />
              <Route path="users/:id" element={<UserDetailsPage />} />
              <Route path="users/:id/edit" element={<UserFormPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
