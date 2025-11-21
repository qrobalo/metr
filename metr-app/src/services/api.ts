const API_BASE_URL = 'http://localhost:5000/api';

// Fonction utilitaire pour les requêtes
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Une erreur est survenue');
  }

  return response.json();
}

// ====================
// AUTHENTIFICATION
// ====================

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

// ====================
// UTILISATEURS
// ====================

export const userAPI = {
  getUser: async (id: number) => {
    return fetchAPI(`/users/${id}`);
  },

  updateUser: async (id: number, data: any) => {
    return fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ====================
// PROJETS
// ====================

export const projectAPI = {
  getProjects: async (userId: number) => {
    return fetchAPI(`/projects?userId=${userId}`);
  },

  getProject: async (id: number) => {
    return fetchAPI(`/projects/${id}`);
  },

  createProject: async (data: any) => {
    return fetchAPI('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProject: async (id: number, data: any) => {
    return fetchAPI(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteProject: async (id: number) => {
    return fetchAPI(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// ====================
// BIBLIOTHÈQUES
// ====================

export const libraryAPI = {
  getBibliotheques: async () => {
    return fetchAPI('/library/bibliotheques');
  },

  createBibliotheque: async (data: any) => {
    return fetchAPI('/library/bibliotheques', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteBibliotheque: async (id: number) => {
    return fetchAPI(`/library/bibliotheques/${id}`, {
      method: 'DELETE',
    });
  },

  getArticles: async (bibliothequeId?: number) => {
    const query = bibliothequeId ? `?bibliothequeId=${bibliothequeId}` : '';
    return fetchAPI(`/library/articles${query}`);
  },

  createArticle: async (data: any) => {
    return fetchAPI('/library/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ====================
// NOTIFICATIONS
// ====================

export const notificationAPI = {
  getNotifications: async () => {
    return fetchAPI('/notifications');
  },
};