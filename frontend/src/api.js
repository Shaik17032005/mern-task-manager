import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api';

const getToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
};

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const storeToken = (token, remember) => {
  if (remember) {
    localStorage.setItem('token', token);
    sessionStorage.removeItem('token');
  } else {
    sessionStorage.setItem('token', token);
    localStorage.removeItem('token');
  }
};

export const api = {
  login: async (email, password, remember = true) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const data = response.data;

    if (data.token) {
      storeToken(data.token, remember);
    }

    return data;
  },

  // FIXED REGISTER FUNCTION
  register: async (name, email, password) => {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
    });

    // DO NOT STORE TOKEN HERE
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  },

  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!getToken();
  },

  getTasks: async ({ search = '', status = 'all', page = 1, limit = 6 } = {}) => {
    const response = await apiClient.get('/tasks', {
      params: { search, status, page, limit },
    });
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data.data;
  },

  updateTask: async (id, updateData) => {
    const response = await apiClient.put(`/tasks/${id}`, updateData);
    return response.data.data;
  },

  deleteTask: async (id) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },
};