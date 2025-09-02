// Configuration des constantes de l'application
export const APP_CONFIG = {
  // URL de l'API backend
  API_BASE_URL: 'https://marcherpub.onrender.com',
  
  // URLs des frontends autorisés
  FRONTEND_URLS: [
    'https://marcher-pub-2y3i.vercel.app',
    'https://marcher-pub-2y3i-2pp0ugaqe-arotoky17s-projects.vercel.app'
  ],
  
  // Configuration des timeouts
  API_TIMEOUT: 10000,
  
  // Configuration des retry
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
};

// Endpoints de l'API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    VERIFY: '/api/auth/verify'
  },
  OFFERS: {
    ALL: '/api/offres',
    PUBLISHED: '/api/offres/published',
    CREATE: '/api/offres',
    UPDATE: (id) => `/api/offres/${id}`,
    DELETE: (id) => `/api/offres/${id}`,
    BY_ID: (id) => `/api/offres/${id}`
  },
  CANDIDATURES: {
    ALL: '/api/candidatures',
    CREATE: '/api/candidatures',
    UPDATE: (id) => `/api/candidatures/${id}`,
    BY_OFFER: (offerId) => `/api/candidatures/offer/${offerId}`
  },
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    BY_ROLE: (role) => `/api/dashboard/${role}`
  }
};

// Fonction utilitaire pour construire les URLs complètes
export const buildApiUrl = (endpoint) => {
  return `${APP_CONFIG.API_BASE_URL}${endpoint}`;
};
