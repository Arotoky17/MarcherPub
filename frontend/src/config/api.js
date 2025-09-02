// Configuration centralisée de l'API
const API_CONFIG = {
  // URL de base du backend
  BASE_URL: process.env.REACT_APP_API_URL || 'https://marcherpub.onrender.com',
  
  // Endpoints d'authentification
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    VERIFY: '/api/auth/verify'
  },
  
  // Endpoints des offres
  OFFERS: {
    ALL: '/api/offres',
    PUBLISHED: '/api/offres/published',
    CREATE: '/api/offres',
    UPDATE: (id) => `/api/offres/${id}`,
    DELETE: (id) => `/api/offres/${id}`,
    BY_ID: (id) => `/api/offres/${id}`
  },
  
  // Endpoints des candidatures
  CANDIDATURES: {
    ALL: '/api/candidatures',
    CREATE: '/api/candidatures',
    UPDATE: (id) => `/api/candidatures/${id}`,
    BY_OFFER: (offerId) => `/api/candidatures/offer/${offerId}`
  },
  
  // Endpoints du dashboard
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    BY_ROLE: (role) => `/api/dashboard/${role}`
  }
};

// Fonction utilitaire pour construire les URLs complètes
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export de la configuration
export default API_CONFIG;
