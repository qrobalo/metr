// metr-app/src/services/api.ts
const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

// Fonction utilitaire pour les requêtes
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE_URL.replace(/\/$/, '')}${endpoint}`;
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // si tu utilises cookies
    });
  } catch (err: any) {
    // fetch failed network error
    throw new Error(`Network error: ${err.message || err}`);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const errMsg = data?.message || response.statusText || 'Une erreur est survenue';
    throw new Error(errMsg);
  }

  return data;
}

// AUTH
export const authAPI = {
  login: async (email: string, password: string) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  register: async (data: any) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// USERS
export const userAPI = {
  getUser: async (id: number) => fetchAPI(`/users/${id}`),
  updateUser: async (id: number, data: any) => fetchAPI(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// PROJECTS
export const projectAPI = {
  getProjects: async (userId: number) => fetchAPI(`/projects?userId=${userId}`),
  getProject: async (id: number) => fetchAPI(`/projects/${id}`),
  createProject: async (data: any) => fetchAPI('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: async (id: number, data: any) => fetchAPI(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: async (id: number) => fetchAPI(`/projects/${id}`, { method: 'DELETE' }),
};

// LIBRARY
export const libraryAPI = {
  getBibliotheques: async () => fetchAPI('/library/bibliotheques'),
  createBibliotheque: async (data: any) => fetchAPI('/library/bibliotheques', { method: 'POST', body: JSON.stringify(data) }),
  deleteBibliotheque: async (id: number) => fetchAPI(`/library/bibliotheques/${id}`, { method: 'DELETE' }),
  getArticles: async (bibliothequeId?: number) => {
    const q = bibliothequeId ? `?bibliothequeId=${bibliothequeId}` : '';
    return fetchAPI(`/library/articles${q}`);
  },
  createArticle: async (data: any) => fetchAPI('/library/articles', { method: 'POST', body: JSON.stringify(data) }),
};

// NOTIFICATIONS
export const notificationAPI = {
  getNotifications: async () => fetchAPI('/notifications'),
};
