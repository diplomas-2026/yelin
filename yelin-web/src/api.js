const API_BASE = process.env.REACT_APP_API_BASE_URL || '/api';

let authToken = localStorage.getItem('token');

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Ошибка API: ${response.status}`;
    try {
      const body = await response.json();
      message = body?.message || body?.error || message;
    } catch {
      // API может вернуть пустой ответ.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  dashboard: () => request('/dashboard'),

  users: () => request('/users'),
  user: (id) => request(`/users/${id}`),
  createUser: (payload) => request('/users', { method: 'POST', body: JSON.stringify(payload) }),
  updateUser: (id, payload) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  projects: () => request('/projects'),
  project: (id) => request(`/projects/${id}`),
  createProject: (payload) => request('/projects', { method: 'POST', body: JSON.stringify(payload) }),
  updateProject: (id, payload) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  updateProjectStatus: (id, status) => request(`/projects/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  documents: (projectId) => request(`/documents${projectId ? `?projectId=${projectId}` : ''}`),
  document: (id) => request(`/documents/${id}`),
  createDocument: (payload) => request('/documents', { method: 'POST', body: JSON.stringify(payload) }),
  updateDocument: (id, payload) => request(`/documents/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteDocument: (id) => request(`/documents/${id}`, { method: 'DELETE' }),

  chatMessages: (projectId) => request(`/projects/${projectId}/chat`),
  lastChatMessage: (projectId) => request(`/projects/${projectId}/chat/last`),
  sendChatMessage: (projectId, message) => request(`/projects/${projectId}/chat`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  }),
};

export const projectStatuses = ['Новый', 'В работе', 'На проверке', 'На доработке', 'Завершен'];
export const documentStatuses = ['В работе', 'На проверке', 'На доработке', 'Завершен'];
export const roles = ['ADMIN', 'PROJECT_MANAGER', 'ENGINEER'];
export const roleLabels = {
  ADMIN: 'Администратор',
  PROJECT_MANAGER: 'Руководитель проекта',
  ENGINEER: 'Инженер',
};
