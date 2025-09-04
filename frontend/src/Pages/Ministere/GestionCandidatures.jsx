import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFileAlt, FaCheck, FaTimes, FaDownload, FaSync } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://marcherpub.onrender.com';

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 }
  }),
};

const GestionCandidatures = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Configuration des interceptors Axios pour gérer les tokens expirés
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

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              console.log('🔄 Token expiré, tentative de renouvellement...');
              const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
                refreshToken
              });

              const { accessToken, token: newToken } = response.data;
              const tokenToUse = accessToken || newToken;

              if (tokenToUse) {
                localStorage.setItem('token', tokenToUse);
                localStorage.setItem('accessToken', tokenToUse);
                originalRequest.headers.Authorization = `Bearer ${tokenToUse}`;
                
                return axios(originalRequest);
              }
            }
          } catch (refreshError) {
            console.error('❌ Échec du renouvellement du token:', refreshError);
            localStorage.clear();
            navigate('/login');
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

  const fetchCandidatures = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      
      if (!token) {
        setError('Token d\'authentification manquant');
        navigate('/login');
        return;
      }
      
      console.log('📡 Récupération des candidatures...');
      
      const res = await axios.get(`${API_BASE_URL}/api/dashboard/ministere`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
      
      console.log('📋 Réponse API:', res.data);
      
      // Vérifier si les candidatures existent dans la réponse
      const candidaturesData = res.data?.candidatures || res.data?.data?.candidatures || [];
      
      if (Array.isArray(candidaturesData)) {
        setCandidatures(candidaturesData);
        console.log(`✅ ${candidaturesData.length} candidatures récupérées`);
      } else {
        console.warn('⚠️ Structure de données inattendue:', res.data);
        setCandidatures([]);
      }
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement des candidatures:', err);
      
      let errorMessage = 'Erreur lors du chargement des candidatures';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Délai d\'attente dépassé. Veuillez réessayer.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Session expirée. Redirection vers la connexion...';
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 403) {
        errorMessage = 'Accès non autorisé. Vous n\'avez pas les permissions nécessaires.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Vérifier si l'utilisateur a les bonnes permissions
    if (user && user.role !== 'ministere') {
      setError('Accès non autorisé. Cette page est réservée aux ministères.');
      return;
    }
    
    fetchCandidatures();
  }, [fetchCandidatures, user]);

  const handleRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    fetchCandidatures();
  };

  // Calculer les statistiques
  const stats = {
    total: candidatures.length,
    enAttente: candidatures.filter(c => c.status === 'en_attente' || c.status === 'pending').length,
    acceptees: candidatures.filter(c => c.status === 'acceptée' || c.status === 'accepted').length,
    rejetees: candidatures.filter(c => c.status === 'rejetée' || c.status === 'rejected').length
  };

  const handleStatusUpdate = async (candidatureId, newStatus) => {
    if (!candidatureId) {
      alert('ID de candidature manquant');
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

      if (!token) {
        alert('Token d\'authentification manquant');
        navigate('/login');
        return;
      }

      console.log('🔄 Mise à jour statut:', { candidatureId, newStatus });

      const res = await axios.patch(`${API_BASE_URL}/api/candidatures/${candidatureId}/status`, {
        status: newStatus
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ Statut mis à jour:', res.data);

      // Mettre à jour la liste locale
      setCandidatures(prev => prev.map(c =>
        c.id === candidatureId || c._id === candidatureId 
          ? { ...c, status: newStatus } 
          : c
      ));

      alert(`Candidature ${newStatus === 'acceptée' ? 'acceptée' : 'rejetée'} avec succès`);
      
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour du statut:', err);
      
      let errorMessage = 'Erreur lors de la mise à jour';
      
      if (err.response?.status === 404) {
        errorMessage = 'Candidature introuvable';
      } else if (err.response?.status === 403) {
        errorMessage = 'Vous n\'avez pas l\'autorisation de modifier cette candidature';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleDeleteCandidature = async (candidatureId) => {
    if (!candidatureId) {
      alert('ID de candidature manquant');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

      if (!token) {
        alert('Token d\'authentification manquant');
        navigate('/login');
        return;
      }

      console.log('🗑️ Suppression candidature:', candidatureId);

      // Essayer différents endpoints possibles pour la suppression
      const endpoints = [
        `/api/candidatures/${candidatureId}`,
        `/api/candidature/${candidatureId}`,
        `/api/dashboard/candidatures/${candidatureId}`,
        `/api/ministere/candidatures/${candidatureId}`,
        `/api/dashboard/ministere/candidatures/${candidatureId}`
      ];

      let success = false;
      let lastError;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Tentative suppression avec: ${API_BASE_URL}${endpoint}`);
          
          await axios.delete(`${API_BASE_URL}${endpoint}`, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          });
          
          console.log('✅ Suppression réussie avec:', endpoint);
          success = true;
          break;
          
        } catch (deleteError) {
          lastError = deleteError;
          if (deleteError.response?.status !== 404) {
            // Si ce n'est pas une 404, on arrête d'essayer
            throw deleteError;
          }
          console.log(`❌ Échec suppression pour: ${endpoint}`);
        }
      }

      if (!success) {
        throw lastError || new Error('Tous les endpoints de suppression ont échoué');
      }

      // Mettre à jour la liste locale
      setCandidatures(prev => prev.filter(c => 
        c.id !== candidatureId && c._id !== candidatureId
      ));

      alert('Candidature supprimée avec succès');
      
    } catch (err) {
      console.error('❌ Erreur lors de la suppression:', err);
      
      let errorMessage = 'Erreur lors de la suppression';
      
      if (err.response?.status === 404) {
        errorMessage = 'Candidature introuvable';
      } else if (err.response?.status === 403) {
        errorMessage = 'Vous n\'avez pas l\'autorisation de supprimer cette candidature';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleDownloadFile = (fileUrl) => {
    if (!fileUrl) return;
    
    // Construire l'URL complète si nécessaire
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${API_BASE_URL}${fileUrl}`;
    
    // Ouvrir dans un nouvel onglet
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className={`text-center text-xl transition-colors ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        Chargement des candidatures...
      </p>
    </div>
  );
  
  if (error) return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`text-center p-6 rounded-lg max-w-md ${
        darkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
      }`}>
        <p className={`font-semibold mb-4 transition-colors ${
          darkMode ? 'text-red-400' : 'text-red-600'
        }`}>
          {error}
        </p>
        <button
          onClick={handleRefresh}
          className={`px-4 py-2 rounded-lg transition-colors ${
            darkMode 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100'
        : 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-900'
    }`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-4xl font-extrabold drop-shadow-lg transition-colors ${
          darkMode ? 'text-indigo-300' : 'text-indigo-700'
        }`}>
          Gestion des Candidatures
        </h1>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
            refreshing
              ? 'opacity-50 cursor-not-allowed'
              : darkMode
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <FaSync className={refreshing ? 'animate-spin' : ''} />

          {refreshing ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

      {/* Statistiques */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`text-center p-6 rounded-lg shadow-lg transition-colors ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`text-3xl font-bold mb-2 transition-colors ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {stats.total}
            </div>
            <div className={`text-sm transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Total candidatures
            </div>
          </div>
          <div className={`text-center p-6 rounded-lg shadow-lg transition-colors ${
            darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'
          }`}>
            <div className={`text-3xl font-bold mb-2 transition-colors ${
              darkMode ? 'text-yellow-300' : 'text-yellow-600'
            }`}>
              {stats.enAttente}
            </div>
            <div className={`text-sm transition-colors ${
              darkMode ? 'text-yellow-400' : 'text-yellow-700'
            }`}>
              En attente
            </div>
          </div>
          <div className={`text-center p-6 rounded-lg shadow-lg transition-colors ${
            darkMode ? 'bg-green-900/30' : 'bg-green-50'
          }`}>
            <div className={`text-3xl font-bold mb-2 transition-colors ${
              darkMode ? 'text-green-300' : 'text-green-600'
            }`}>
              {stats.acceptees}
            </div>
            <div className={`text-sm transition-colors ${
              darkMode ? 'text-green-400' : 'text-green-700'
            }`}>
              Acceptées
            </div>
          </div>
          <div className={`text-center p-6 rounded-lg shadow-lg transition-colors ${
            darkMode ? 'bg-red-900/30' : 'bg-red-50'
          }`}>
            <div className={`text-3xl font-bold mb-2 transition-colors ${
              darkMode ? 'text-red-300' : 'text-red-600'
            }`}>
              {stats.rejetees}
            </div>
            <div className={`text-sm transition-colors ${
              darkMode ? 'text-red-400' : 'text-red-700'
            }`}>
              Rejetées
            </div>
          </div>
        </div>
      </div>

      {candidatures.length === 0 ? (
        <div className={`text-center py-12 rounded-lg shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <FaFileAlt className={`mx-auto mb-4 text-6xl opacity-50 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <p className={`text-lg transition-colors ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Aucune candidature reçue pour le moment.
          </p>
        </div>
      ) : (
        <div className={`overflow-x-auto rounded-lg shadow-lg transition-colors ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <table className={`min-w-full border-collapse transition-colors ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <thead>
              <tr className={`font-semibold transition-colors ${
                darkMode
                  ? 'bg-indigo-900 text-indigo-300'
                  : 'bg-indigo-100 text-indigo-800'
              }`}>
                <th className={`p-4 text-left border transition-colors ${
                  darkMode ? 'border-indigo-700' : 'border-indigo-200'
                }`}>Entreprise</th>
                <th className={`p-4 text-left border transition-colors ${
                  darkMode ? 'border-indigo-700' : 'border-indigo-200'
                }`}>Message</th>
                <th className={`p-4 text-left border transition-colors ${
                  darkMode ? 'border-indigo-700' : 'border-indigo-200'
                }`}>Date</th>
                <th className={`p-4 text-left border transition-colors ${
                  darkMode ? 'border-indigo-700' : 'border-indigo-200'
                }`}>Fichier</th>
                <th className={`p-4 text-left border transition-colors ${
                  darkMode ? 'border-indigo-700' : 'border-indigo-200'
                }`}>Statut</th>
                <th className={`p-4 text-left border transition-colors ${
                  darkMode ? 'border-indigo-700' : 'border-indigo-200'
                }`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidatures.map((c, index) => {
                const candidatureId = c.id || c._id;
                const entrepriseName = c.entreprise?.nom || c.entrepriseName || `ID: ${c.entrepriseId || 'Inconnu'}`;
                const candidatureStatus = c.status || 'en_attente';
                
                return (
                  <motion.tr
                    key={candidatureId || index}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    className={`border-t transition-colors ${
                      darkMode
                        ? 'border-indigo-700 hover:bg-indigo-900/30'
                        : 'border-indigo-200 hover:bg-indigo-50'
                    }`}
                  >
                    <td className={`p-4 border transition-colors ${
                      darkMode ? 'border-indigo-700' : 'border-indigo-200'
                    }`}>
                      <div className="font-medium">{entrepriseName}</div>
                      {c.entreprise?.email && (
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {c.entreprise.email}
                        </div>
                      )}
                    </td>
                    <td className={`p-4 border transition-colors max-w-xs ${
                      darkMode ? 'border-indigo-700' : 'border-indigo-200'
                    }`}>
                      <div className="truncate" title={c.message}>
                        {c.message || 'Aucun message'}
                      </div>
                    </td>
                    <td className={`p-4 border transition-colors ${
                      darkMode ? 'border-indigo-700' : 'border-indigo-200'
                    }`}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Date inconnue'}
                    </td>
                    <td className={`p-4 border transition-colors ${
                      darkMode ? 'border-indigo-700' : 'border-indigo-200'
                    }`}>
                      {c.fileUrl ? (
                        <button
                          onClick={() => handleDownloadFile(c.fileUrl)}
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded transition-all hover:shadow-md ${
                            darkMode
                              ? 'bg-indigo-700 hover:bg-indigo-600 text-indigo-200'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                          title="Télécharger le fichier"
                        >
                          <FaDownload className="text-sm" />
                          Fichier
                        </button>
                      ) : (
                        <span className={`italic transition-colors ${
                          darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          Aucun fichier
                        </span>
                      )}
                    </td>
                    <td className={`p-4 border transition-colors ${
                      darkMode ? 'border-indigo-700' : 'border-indigo-200'
                    }`}>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        (candidatureStatus === 'en_attente' || candidatureStatus === 'pending')
                          ? (darkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800')
                          : (candidatureStatus === 'acceptée' || candidatureStatus === 'accepted')
                          ? (darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800')
                          : (darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800')
                      }`}>
                        {candidatureStatus === 'en_attente' ? 'En attente' 
                         : candidatureStatus === 'pending' ? 'En attente'
                         : candidatureStatus === 'acceptée' ? 'Acceptée'
                         : candidatureStatus === 'accepted' ? 'Acceptée'
                         : candidatureStatus === 'rejetée' ? 'Rejetée'
                         : candidatureStatus === 'rejected' ? 'Rejetée'
                         : candidatureStatus}
                      </span>
                    </td>
                    <td className={`p-4 border transition-colors ${
                      darkMode ? 'border-indigo-700' : 'border-indigo-200'
                    }`}>
                      <div className="flex gap-2 items-center flex-wrap">
                        {(candidatureStatus === 'en_attente' || candidatureStatus === 'pending') ? (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(candidatureId, 'acceptée')}
                              className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-all hover:shadow-md"
                              title="Accepter la candidature"
                            >
                              <FaCheck className="text-sm" />
                              Accepter
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(candidatureId, 'rejetée')}
                              className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-all hover:shadow-md"
                              title="Rejeter la candidature"
                            >
                              <FaTimes className="text-sm" />
                              Rejeter
                            </button>
                          </>
                        ) : (
                          <span className={`text-sm italic transition-colors ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            Traitée
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteCandidature(candidatureId)}
                          className={`flex items-center gap-1 px-3 py-1 rounded transition-all hover:shadow-md ${
                            darkMode
                              ? 'text-red-300 hover:text-red-200 bg-red-900/30 hover:bg-red-900/50'
                              : 'text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200'
                          }`}
                          title="Supprimer la candidature"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GestionCandidatures;