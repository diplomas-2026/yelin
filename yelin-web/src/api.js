const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;
    try {
      const body = await response.json();
      message = body?.message || body?.error || message;
    } catch {
      // ignore json parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function loadProjects() {
  return request('/projects');
}

export function loadProject(projectId) {
  return request(`/projects/${projectId}`);
}

export function loadUsers() {
  return request('/users');
}

export function loadDashboard() {
  return request('/dashboard');
}

export function loadRemarks() {
  return request('/remarks');
}

export function loadNotifications() {
  return request('/notifications');
}

export function loadAuditLog() {
  return request('/audit-log');
}

export function loadDocumentReviewQueue() {
  return request('/documents/review');
}

export function loadVersions() {
  return request('/versions');
}

export function approveDocument(documentId, payload) {
  return request(`/documents/${documentId}/approve`, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}

export function returnDocument(documentId, payload) {
  return request(`/documents/${documentId}/return`, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}

export function createDocumentRemark(documentId, payload) {
  return request(`/documents/${documentId}/remarks`, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}

export function uploadDocumentVersion(documentId, payload) {
  return request(`/documents/${documentId}/versions`, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}

export function sendDocumentToReview(documentId, payload) {
  return request(`/documents/${documentId}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}

export function setNotificationRead(notificationId, read) {
  return request(`/notifications/${notificationId}`, {
    method: 'PATCH',
    body: JSON.stringify({ read }),
  });
}

export function markAllNotificationsRead(userEmail) {
  return request('/notifications/read-all', {
    method: 'POST',
    body: JSON.stringify({ userEmail }),
  });
}

export async function loadWorkspace() {
  const [dashboard, projects, users, remarks, notifications, auditLog, documentReviewQueue, versions] = await Promise.all([
    loadDashboard(),
    loadProjects(),
    loadUsers(),
    loadRemarks(),
    loadNotifications(),
    loadAuditLog(),
    loadDocumentReviewQueue(),
    loadVersions(),
  ]);

  const projectDetails = await Promise.all(projects.map((project) => loadProject(project.id)));

  return {
    dashboard,
    projects,
    users,
    remarks,
    notifications,
    auditLog,
    documentReviewQueue,
    versions,
    projectDetails,
  };
}
