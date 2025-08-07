import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

const GestionOffres = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOffres = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      
      const response = await axios.get(`${API_BASE_URL}/api/offres`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setOffres(response.data.offres || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur récupération offres:', error);
      setError('Erreur lors du chargement des offres');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffres();
  }, []);

  const handleValidateOffer = async (offerId) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      
      await axios.put(`${API_BASE_URL}/api/offres/${offerId}/validate`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Rafraîchir la liste
      fetchOffres();
      alert('Offre validée avec succès !');
    } catch (error) {
      console.error('Erreur validation:', error);
      alert('Erreur lors de la validation de l\'offre');
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      
      await axios.put(`${API_BASE_URL}/api/offres/${offerId}/reject`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Rafraîchir la liste
      fetchOffres();
      alert('Offre rejetée !');
    } catch (error) {
      console.error('Erreur rejet:', error);
      alert('Erreur lors du rejet de l\'offre');
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        const token = localStorage.getItem('token');
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        
        await axios.delete(`${API_BASE_URL}/api/offres/${offerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Rafraîchir la liste
        fetchOffres();
        alert('Offre supprimée !');
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression de l\'offre');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'en_attente': {
        bg: darkMode ? 'bg-yellow-900' : 'bg-yellow-100',
        text: darkMode ? 'text-yellow-300' : 'text-yellow-800',
        label: '⏳ En attente'
      },
      'valide': {
        bg: darkMode ? 'bg-green-900' : 'bg-green-100',
        text: darkMode ? 'text-green-300' : 'text-green-800',
        label: '✅ Validée'
      },
      'rejetée': {
        bg: darkMode ? 'bg-red-900' : 'bg-red-100',
        text: darkMode ? 'text-red-300' : 'text-red-800',
        label: '❌ Rejetée'
      }
    };
    
    const badge = badges[status] || {
      bg: darkMode ? 'bg-gray-700' : 'bg-gray-100',
      text: darkMode ? 'text-gray-300' : 'text-gray-800',
      label: status
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold transition-colors ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                📋 Gestion des Offres
              </h1>
              <p className={`mt-2 transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Gérez toutes les offres de marchés publics
              </p>
            </div>
            <button
              onClick={() => navigate('/ministere/home')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              ← Retour
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-lg shadow transition-colors ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-2xl font-bold text-blue-600">{offres.length}</div>
            <div className={`text-sm transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Total des offres</div>
          </div>
          <div className={`p-6 rounded-lg shadow transition-colors ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-2xl font-bold text-yellow-600">
              {offres.filter(o => o.status === 'en_attente').length}
            </div>
            <div className={`text-sm transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>En attente</div>
          </div>
          <div className={`p-6 rounded-lg shadow transition-colors ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-2xl font-bold text-green-600">
              {offres.filter(o => o.status === 'valide').length}
            </div>
            <div className={`text-sm transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Validées</div>
          </div>
          <div className={`p-6 rounded-lg shadow transition-colors ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-2xl font-bold text-red-600">
              {offres.filter(o => o.status === 'rejetée').length}
            </div>
            <div className={`text-sm transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Rejetées</div>
          </div>
        </div>

        {/* Liste des offres */}
        {error && (
          <div className={`border rounded-lg p-4 mb-6 transition-colors ${
            darkMode
              ? 'bg-red-900/50 border-red-700 text-red-300'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div>{error}</div>
          </div>
        )}

        {offres.length === 0 ? (
          <div className={`rounded-lg shadow p-8 text-center transition-colors ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`text-lg transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Aucune offre trouvée</div>
          </div>
        ) : (
          <div className={`rounded-lg shadow overflow-hidden transition-colors ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y transition-colors ${
                darkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                <thead className={`transition-colors ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Offre
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Domaine
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Date Limite
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Statut
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y transition-colors ${
                  darkMode
                    ? 'bg-gray-800 divide-gray-700'
                    : 'bg-white divide-gray-200'
                }`}>
                  {offres.map((offre) => (
                    <tr key={offre.id} className={`transition-colors ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}>
                      <td className="px-6 py-4">
                        <div>
                          <div className={`text-sm font-medium transition-colors ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {offre.title}
                          </div>
                          <div className={`text-sm truncate max-w-xs transition-colors ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {offre.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full transition-colors ${
                          darkMode
                            ? 'bg-blue-900 text-blue-300'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {offre.domaine}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {new Date(offre.dateLimite).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(offre.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {offre.status === 'en_attente' && (
                          <>
                            <button
                              onClick={() => handleValidateOffer(offre.id)}
                              className={`px-3 py-1 rounded transition-colors ${
                                darkMode
                                  ? 'text-green-300 hover:text-green-200 bg-green-900 hover:bg-green-800'
                                  : 'text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200'
                              }`}
                            >
                              ✅ Valider
                            </button>
                            <button
                              onClick={() => handleRejectOffer(offre.id)}
                              className={`px-3 py-1 rounded transition-colors ${
                                darkMode
                                  ? 'text-red-300 hover:text-red-200 bg-red-900 hover:bg-red-800'
                                  : 'text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200'
                              }`}
                            >
                              ❌ Rejeter
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteOffer(offre.id)}
                          className={`px-3 py-1 rounded transition-colors ${
                            darkMode
                              ? 'text-red-300 hover:text-red-200 bg-gray-700 hover:bg-gray-600'
                              : 'text-red-600 hover:text-red-900 bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          🗑️ Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionOffres;