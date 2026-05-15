const API_URL = '/api';

function getToken() {
  return localStorage.getItem('infomate_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// Auth
export const authAPI = {
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
};

// Subjects
export const subjectsAPI = {
  getAll: () => request('/subjects'),
  create: (body) => request('/subjects', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id) => request(`/subjects/${id}`, { method: 'DELETE' }),
};

// Timetable
export const timetableAPI = {
  getAll: (day) => request(`/timetable${day ? `?day=${day}` : ''}`),
  create: (body) => request('/timetable', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id) => request(`/timetable/${id}`, { method: 'DELETE' }),
};

// Attendance
export const attendanceAPI = {
  getSummary: () => request('/attendance/summary'),
  mark: (body) => request('/attendance', { method: 'POST', body: JSON.stringify(body) }),
  getBySubject: (subjectId) => request(`/attendance/subject/${subjectId}`),
};

// AI
export const aiAPI = {
  chat: (body) => request('/ai/chat', { method: 'POST', body: JSON.stringify(body) }),
  getHistory: (subjectId) => request(`/ai/history/${subjectId}`),
};

// Goals
export const goalsAPI = {
  getAll: () => request('/goals'),
  create: (body) => request('/goals', { method: 'POST', body: JSON.stringify(body) }),
  toggle: (id) => request(`/goals/${id}`, { method: 'PATCH' }),
  delete: (id) => request(`/goals/${id}`, { method: 'DELETE' }),
};

// Activity
export const activityAPI = {
  getRecent: () => request('/activity'),
  getNotifications: () => request('/activity/notifications'),
  markRead: (id) => request(`/activity/notifications/${id}/read`, { method: 'PATCH' }),
};
