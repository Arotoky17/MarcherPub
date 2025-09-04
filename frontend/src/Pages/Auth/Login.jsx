import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaSun, FaMoon } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://marcherpub.onrender.com';

const ROUTES = {
  MINISTERE: '/ministere/home',
  ENTREPRISE: '/entreprise/home',
  DEFAULT: '/',
  REGISTER: '/register'
};

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [uiState, setUiState] = useState({
    showPassword: false,
    error: '',
    success: '',
    isMobile: false,
    isLoading: false
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();

  // Configuration des interceptors Axios pour la gestion JWT
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Gestion du token expiré
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              console.log('🔄 Tentative de renouvellement du token...');
              const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
                refreshToken
              });

              const { accessToken, token: newToken } = response.data;
              const tokenToUse = accessToken || newToken;

              if (tokenToUse) {
                localStorage.setItem('token', tokenToUse);
                localStorage.setItem('accessToken', tokenToUse);
                originalRequest.headers.Authorization = `Bearer ${tokenToUse}`;
                
                console.log('✅ Token renouvelé avec succès');
                return axios(originalRequest);
              }
            }
          } catch (refreshError) {
            console.error('❌ Échec du renouvellement du token:', refreshError);
            localStorage.removeItem('token');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  // Check screen size for mobile responsiveness
  useEffect(() => {
    const checkScreenSize = () => {
      setUiState(prev => ({
        ...prev,
        isMobile: window.innerWidth < 768
      }));
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer les erreurs quand l'utilisateur tape
    if (uiState.error) {
      setUiState(prev => ({ ...prev, error: '' }));
    }
  }, [uiState.error]);

  const determineRedirectRoute = useCallback((userRole, customRedirect) => {
    if (customRedirect) return customRedirect;
    
    switch (userRole?.toLowerCase()) {
      case 'ministere':
        return ROUTES.MINISTERE;
      case 'entreprise':
        return ROUTES.ENTREPRISE;
      default:
        return ROUTES.DEFAULT;
    }
  }, []);

  // Handle form submission and login
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();

    // Validation des champs
    if (!formData.username.trim() || !formData.password.trim()) {
      setUiState(prev => ({ 
        ...prev, 
        error: 'Veuillez remplir tous les champs' 
      }));
      return;
    }

    setUiState(prev => ({ ...prev, error: '', success: '', isLoading: true }));

    try {
      console.log('🔐 Tentative de connexion...');
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username: formData.username.trim(),
        password: formData.password
      }, {
        timeout: 15000, // 15 secondes pour Render
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Réponse reçue:', response.status);

      const { 
        token, 
        accessToken, 
        refreshToken, 
        user, 
        redirectTo 
      } = response.data;

      // Utiliser accessToken en priorité, puis token
      const authToken = accessToken || token;
      const userRole = user?.role;

      if (!authToken || !user) {
        throw new Error('Réponse invalide du serveur');
      }

      console.log('👤 Utilisateur connecté:', userRole);

      // Sauvegarder les tokens
      localStorage.setItem('token', authToken);
      localStorage.setItem('accessToken', authToken);
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        console.log('🔑 Refresh token sauvegardé');
      }

      // Sauvegarder les données utilisateur
      localStorage.setItem('user', JSON.stringify(user));

      // Mettre à jour le contexte d'authentification
      await login({ 
        token: authToken, 
        role: userRole, 
        redirectTo, 
        ...user 
      });

      setUiState(prev => ({
        ...prev,
        success: `Connecté avec succès en tant que ${userRole}`,
        isLoading: false
      }));

      // Redirection après un court délai
      setTimeout(() => {
        const redirectRoute = determineRedirectRoute(userRole, redirectTo);
        console.log('🔄 Redirection vers:', redirectRoute);
        navigate(redirectRoute, { replace: true });
      }, 1500);

      console.log('✅ Login terminé avec succès');

    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      
      let errorMessage = 'Une erreur est survenue';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Délai d\'attente dépassé. Le serveur met du temps à répondre.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
      } else if (error.response?.status === 429) {
        errorMessage = 'Trop de tentatives. Veuillez réessayer dans quelques minutes.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setUiState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        success: '', 
        isLoading: false 
      }));
    }
  }, [formData, login, navigate, determineRedirectRoute]);

  const togglePasswordVisibility = useCallback(() => {
    setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  return (
    <div className={`flex min-h-screen items-center justify-center p-4 ${uiState.isMobile ? 'pt-16' : ''} relative transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Bouton Mode Sombre */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition-colors ${
          darkMode
            ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Changer le thème"
      >
        {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
      </button>

      {/* Bouton Retour à l'accueil */}
      <Link
        to="/"
        className={`absolute top-6 left-6 flex items-center gap-2 transition-colors duration-200 px-3 py-2 rounded-lg shadow-md hover:shadow-lg ${
          darkMode
            ? 'text-sky-400 hover:text-sky-300 bg-gray-800/80 hover:bg-gray-800'
            : 'text-sky-600 hover:text-sky-800 bg-white/80 hover:bg-white'
        }`}
      >
        <FaHome className="h-4 w-4" />
        <span className="text-sm font-medium">Accueil</span>
      </Link>

      <form
        onSubmit={handleLogin}
        className={`p-6 rounded-2xl shadow-lg w-full ${uiState.isMobile ? 'max-w-xs' : 'max-w-md'} transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
        }`}
        noValidate
      >
        <h2 className={`${uiState.isMobile ? 'text-2xl' : 'text-3xl'} font-semibold mb-6 text-center transition-colors ${
          darkMode ? 'text-sky-400' : 'text-sky-600'
        }`}>
          Connexion
        </h2>

        {uiState.error && (
          <div className={`px-4 py-3 rounded mb-4 text-sm border transition-colors ${
            darkMode
              ? 'bg-red-900/50 border-red-700 text-red-300'
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            {uiState.error}
          </div>
        )}

        {uiState.success && (
          <div className={`px-4 py-3 rounded mb-4 text-sm border transition-colors ${
            darkMode
              ? 'bg-green-900/50 border-green-700 text-green-300'
              : 'bg-green-100 border-green-400 text-green-700'
          }`}>
            {uiState.success}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="username" className={`block text-sm font-medium mb-1 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Nom d'utilisateur
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Entrez votre nom d'utilisateur"
            required
            autoComplete="username"
            disabled={uiState.isLoading}
            className={`w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-all ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            } ${uiState.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className={`block text-sm font-medium mb-1 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={uiState.showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Entrez votre mot de passe"
              required
              autoComplete="current-password"
              disabled={uiState.isLoading}
              className={`w-full p-2 pr-10 rounded border focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-all ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              } ${uiState.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={uiState.isLoading}
              className={`absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none transition-colors ${
                darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
              } ${uiState.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={uiState.showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {uiState.showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={uiState.isLoading}
          className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center ${
            uiState.isLoading 
              ? 'bg-gray-400 cursor-not-allowed opacity-75' 
              : 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 hover:shadow-lg'
          } text-white`}
        >
          {uiState.isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion en cours...
            </>
          ) : 'Se connecter'}
        </button>

        <div className="text-center mt-4 text-sm">
          <p className={`transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Pas encore de compte ?{' '}
            <Link
              to={ROUTES.REGISTER}
              className={`underline transition duration-200 font-medium ${
                darkMode
                  ? 'text-sky-400 hover:text-sky-300'
                  : 'text-sky-600 hover:text-sky-800'
              }`}
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;