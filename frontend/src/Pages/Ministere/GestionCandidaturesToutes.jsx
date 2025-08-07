import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock, FaBuilding, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const GestionCandidaturesToutes = () => {
  const { darkMode } = useTheme();
  const [candidatures, setCandidatures] = useState([]);
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOffre, setSelectedOffre] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffres();
  }, []);

  useEffect(() => {
    if (selectedOffre) {
      fetchCandidatures(selectedOffre);
    } else {
      setCandidatures([]);
    }
  }, [selectedOffre]);

  const fetchOffres = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/offres`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des offres');
      }

      const data = await response.json();
      setOffres(data.offres || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchCandidatures = async (offreId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/candidatures/offer/${offreId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des candidatures');
      }

      const data = await response.json();
      setCandidatures(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateCandidatureStatus = async (candidatureId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/candidatures/${candidatureId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      // Refresh candidatures après mise à jour
      if (selectedOffre) {
        fetchCandidatures(selectedOffre);
      }
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valide':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejetee':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'valide':
        return 'Acceptée';
      case 'rejetee':
        return 'Rejetée';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valide':
        return 'bg-green-100 text-green-800';
      case 'rejetee':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredCandidatures = candidatures.filter(candidature => {
    if (statusFilter === 'all') return true;
    return candidature.status === statusFilter;
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`border px-4 py-3 rounded ${
            darkMode
              ? 'bg-red-900 border-red-600 text-red-200'
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            <p className="font-bold">Erreur</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`shadow-sm border-b ${
        darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/ministere/home')}
                className={`mr-4 p-2 rounded-full transition-colors ${
                  darkMode
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Gestion des Candidatures
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className={`rounded-lg shadow-md p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Sélectionner une offre
              </label>
              <select
                value={selectedOffre}
                onChange={(e) => setSelectedOffre(e.target.value)}
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">-- Choisir une offre --</option>
                {offres.map(offre => (
                  <option key={offre.id} value={offre.id}>
                    {offre.title} ({offre.status})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Filtrer par statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="valide">Acceptées</option>
                <option value="rejetee">Rejetées</option>
              </select>
            </div>
          </div>
        </div>

        {/* Candidatures List */}
        {!selectedOffre ? (
          <div className="text-center py-12">
            <FaBuilding className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sélectionnez une offre
            </h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Choisissez une offre pour voir les candidatures correspondantes.
            </p>
          </div>
        ) : filteredCandidatures.length === 0 ? (
          <div className="text-center py-12">
            <FaFileAlt className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Aucune candidature
            </h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Aucune candidature trouvée pour cette offre avec les filtres sélectionnés.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCandidatures.map((candidature) => (
              <CandidatureManagementCard
                key={candidature.id}
                candidature={candidature}
                darkMode={darkMode}
                onUpdateStatus={updateCandidatureStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour gérer chaque candidature
const CandidatureManagementCard = ({ candidature, darkMode, onUpdateStatus }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'valide':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejetee':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'valide':
        return 'Acceptée';
      case 'rejetee':
        return 'Rejetée';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valide':
        return darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'rejetee':
        return darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
      default:
        return darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className={`rounded-lg shadow-md p-6 transition-colors ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <FaBuilding className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {candidature.entreprise?.companyName || 'Nom d\'entreprise non renseigné'}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {candidature.entreprise?.username} - {candidature.entreprise?.email}
              </p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-4 text-sm mb-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1 h-4 w-4" />
              <span>Candidature du {new Date(candidature.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {candidature.fileUrl && (
            <div className="mb-4">
              <a
                href={`${API_BASE_URL}${candidature.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center underline transition-colors ${
                  darkMode
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                <FaFileAlt className="mr-1 h-4 w-4" />
                Télécharger le fichier joint
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end space-y-3 ml-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidature.status)}`}>
            <span className="mr-1">{getStatusIcon(candidature.status)}</span>
            {getStatusText(candidature.status)}
          </span>

          {candidature.status === 'en_attente' && (
            <div className="flex space-x-2">
              <button
                onClick={() => onUpdateStatus(candidature.id, 'valide')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center transition-colors"
              >
                <FaCheckCircle className="mr-1" />
                Accepter
              </button>
              <button
                onClick={() => onUpdateStatus(candidature.id, 'rejetee')}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center transition-colors"
              >
                <FaTimesCircle className="mr-1" />
                Rejeter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionCandidaturesToutes;