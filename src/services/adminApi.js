const API_URL = '/api/admin';

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
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export const adminAPI = {
  // Stats
  getStats: () => request('/stats'),

  // Users
  getUsers: () => request('/users'),
  getUser: (id) => request(`/users/${id}`),
  createUser: (body) => request('/users', { method: 'POST', body: JSON.stringify(body) }),
  updateUser: (id, body) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // Subjects
  getSubjects: () => request('/subjects'),
  assignSubjects: (body) => request('/subjects/assign', { method: 'POST', body: JSON.stringify(body) }),
  deleteSubject: (id) => request(`/subjects/${id}`, { method: 'DELETE' }),

  // Timetable
  getTimetable: (userId) => request(`/timetable${userId ? `?userId=${userId}` : ''}`),
  createTimetable: (body) => request('/timetable', { method: 'POST', body: JSON.stringify(body) }),
  deleteTimetable: (id) => request(`/timetable/${id}`, { method: 'DELETE' }),

  // Notifications
  sendNotification: (body) => request('/notifications', { method: 'POST', body: JSON.stringify(body) }),

  // Attendance
  getAttendance: () => request('/attendance'),
};
