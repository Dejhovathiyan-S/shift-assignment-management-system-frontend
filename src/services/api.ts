// ============================================================
// API Service — connects to every backend endpoint exactly
// ============================================================
// Backend routes from index.js:
//   /users       → userAPI.js
//   /requests    → requestAPI.js
//   /shifts      → shiftAPI.js
//   /shift-requests → shiftRequestAPI.js
//   /assignments → assignmentAPI.js
// ============================================================

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on auth failure
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===================== AUTH — /users =====================
export const authAPI = {
  // POST /users/signup
  signup: (data: { name: string; email: string; password: string; role: string; age: number }) =>
    api.post('/users/signup', data),

  // POST /users/login
  login: (data: { email: string; password: string }) =>
    api.post('/users/login', data),

  // GET /users/me  (requires auth)
  getMe: () => api.get('/users/me'),

  // POST /users/logout (requires auth)
  logout: () => api.post('/users/logout'),

  // PUT /users/forgot-password
  forgotPassword: (data: { email: string; newPassword: string }) =>
    api.put('/users/forgot-password', data),
};

// ===================== SHIFTS — /shifts =====================
export const shiftAPI = {
  // POST /shifts/create  (Manager only)
  create: (data: { title: string; date: string; startTime: string; endTime: string }) =>
    api.post('/shifts/create', data),

  // GET /shifts/all
  getAll: () => api.get('/shifts/all'),

  // GET /shifts/available
  getAvailable: () => api.get('/shifts/available'),

  // GET /shifts/:id
  getById: (id: string) => api.get(`/shifts/${id}`),

  // PUT /shifts/:id  (Manager only)
  update: (id: string, data: { title?: string; date?: string; startTime?: string; endTime?: string; status?: string }) =>
    api.put(`/shifts/${id}`, data),

  // DELETE /shifts/:id  (Manager only)
  delete: (id: string) => api.delete(`/shifts/${id}`),
};

// ============= SHIFT REQUESTS — /shift-requests =============
export const shiftRequestAPI = {
  // POST /shift-requests/create  (Staff only)
  create: (data: { shiftId: string; reason?: string }) =>
    api.post('/shift-requests/create', data),

  // GET /shift-requests/my-requests  (Staff)
  getMyRequests: () => api.get('/shift-requests/my-requests'),

  // GET /shift-requests/pending  (Manager)
  getPending: () => api.get('/shift-requests/pending'),

  // PUT /shift-requests/approve/:id  (Manager)
  approve: (id: string) => api.put(`/shift-requests/approve/${id}`),

  // PUT /shift-requests/reject/:id  (Manager)
  reject: (id: string, data: { rejectionReason?: string }) =>
    api.put(`/shift-requests/reject/${id}`, data),

  // DELETE /shift-requests/cancel/:id  (Staff)
  cancel: (id: string) => api.delete(`/shift-requests/cancel/${id}`),
};

// ============= ASSIGNMENTS — /assignments =============
export const assignmentAPI = {
  // GET /assignments/all  (Manager)
  getAll: () => api.get('/assignments/all'),

  // GET /assignments/my-assignments  (Staff)
  getMyAssignments: () => api.get('/assignments/my-assignments'),

  // GET /assignments/:id
  getById: (id: string) => api.get(`/assignments/${id}`),

  // PUT /assignments/:id  (Manager)
  updateStatus: (id: string, data: { status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' }) =>
    api.put(`/assignments/${id}`, data),
};

// ============= CHANGE REQUESTS — /requests =============
export const changeRequestAPI = {
  // POST /requests/change-request/create
  create: (data: { title: string; description: string; priority: string; requestedTo: string }) =>
    api.post('/requests/change-request/create', data),

  // GET /requests/change-request/user-requests
  getUserRequests: () => api.get('/requests/change-request/user-requests'),

  // GET /requests/change-request/user-pending-requests
  getUserPendingRequests: () => api.get('/requests/change-request/user-pending-requests'),

  // GET /requests/change-request/agent-my-requests
  getAgentRequests: () => api.get('/requests/change-request/agent-my-requests'),

  // GET /requests/change-request/agent-my-pending-requests
  getAgentPendingRequests: () => api.get('/requests/change-request/agent-my-pending-requests'),
};

export default api;
