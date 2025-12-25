import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Interns API
export const internsAPI = {
  getAll: async (filters?: { status?: string; domain?: string; search?: string }) => {
    const response = await api.get('/interns', { params: filters });
    return response.data;
  },
  
  getByEmployeeId: async (employeeId: string) => {
    const response = await api.get(`/interns/${employeeId}`);
    return response.data;
  },
  
  create: async (internData: any) => {
    const response = await api.post('/interns', internData);
    return response.data;
  },
  
  update: async (id: string, internData: any) => {
    const response = await api.put(`/interns/${id}`, internData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/interns/${id}`);
    return response.data;
  },
  
  sendOfferLetter: async (id: string) => {
    const response = await api.post(`/interns/${id}/send-offer`);
    return response.data;
  },
  
  previewOfferLetter: async (id: string) => {
    const response = await api.get(`/interns/${id}/preview-offer`, {
      responseType: 'text',
    });
    return response.data;
  },
  
  sendCertificate: async (id: string) => {
    const response = await api.post(`/interns/${id}/send-certificate`);
    return response.data;
  },
  
  previewCertificate: async (id: string) => {
    const response = await api.get(`/interns/${id}/preview-certificate`, {
      responseType: 'text',
    });
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/interns/stats');
    return response.data;
  },
};

// Contact API
export const contactAPI = {
  create: async (contactData: { name: string; email: string; subject: string; message: string; phone?: string }) => {
    const response = await api.post('/contacts', contactData);
    return response.data;
  },

  getAll: async (filters?: { status?: string; search?: string }) => {
    const response = await api.get('/contacts', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: 'new' | 'read' | 'responded') => {
    const response = await api.put(`/contacts/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/contacts/stats');
    return response.data;
  },
};

export default api;
