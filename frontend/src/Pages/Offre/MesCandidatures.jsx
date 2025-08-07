import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFileAlt, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock, FaFilter } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const MesCandidatures = () => {
  const { darkMode } = useTheme();
  const [candidatures, setCandidatures] = useState([]);
  const [filteredCandidatures, setFilteredCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Utilisateur non authentifié');
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/candidatures/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des candidatures');
        return res.json();
      })
      .then(data => {
        setCandidatures(data);
        setFilteredCandidatures(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filtrage par statut
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredCandidatures(candidatures);
    } else {
      setFilteredCandidatures(candidatures.filter(c => c.status === statusFilter));
    }
  }, [statusFilter, candidatures]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'acceptée':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejetée':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'acceptée':
        return 'Acceptée';
      case 'rejetée':
        return 'Rejetée';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'acceptée':
        return darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'rejetée':
        return darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
      default:
        return darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
    }
  };

  // Calculer les statistiques
  const stats = {
    total: candidatures.length,
    enAttente: candidatures.filter(c => c.status === 'en_attente').length,
    acceptees: candidatures.filter(c => c.status === 'acceptée').length,
    rejetees: candidatures.filter(c => c.status === 'rejetée').length
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Chargement de vos candidatures...</p>
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
                onClick={() => navigate('/entreprise/home')}
                className={`mr-4 p-2 rounded-full transition-colors ${
                  darkMode
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Mes Candidatures
              </h1>
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {filteredCandidatures.length} sur {candidatures.length} candidature{candidatures.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className={`border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</div>
            </div>
            <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
              <div className={`text-2xl font-bold ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>{stats.enAttente}</div>
              <div className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>En attente</div>
            </div>
            <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
              <div className={`text-2xl font-bold ${darkMode ? 'text-green-200' : 'text-green-800'}`}>{stats.acceptees}</div>
              <div className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Acceptées</div>
            </div>
            <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-red-900' : 'bg-red-100'}`}>
              <div className={`text-2xl font-bold ${darkMode ? 'text-red-200' : 'text-red-800'}`}>{stats.rejetees}</div>
              <div className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>Rejetées</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaFilter className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">Tous les statuts ({stats.total})</option>
              <option value="en_attente">En attente ({stats.enAttente})</option>
              <option value="acceptée">Acceptées ({stats.acceptees})</option>
              <option value="rejetée">Rejetées ({stats.rejetees})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {candidatures.length === 0 ? (
          <div className="text-center py-12">
            <FaFileAlt className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Aucune candidature
            </h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Vous n'avez encore envoyé aucune candidature.
            </p>
          </div>
        ) : filteredCandidatures.length === 0 ? (
          <div className="text-center py-12">
            <FaFileAlt className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Aucun résultat
            </h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Aucune candidature ne correspond au filtre sélectionné.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCandidatures.map((candidature) => (
              <CandidatureCard key={candidature.id} candidature={candidature} darkMode={darkMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour chaque candidature
const CandidatureCard = ({ candidature, darkMode }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'acceptée':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejetée':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'acceptée':
        return 'Acceptée';
      case 'rejetée':
        return 'Rejetée';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'acceptée':
        return darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'rejetée':
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
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {candidature.Offer?.title || `Offre #${candidature.offerId}`}
          </h3>
          
          <div className={`flex items-center space-x-4 text-sm mb-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1 h-4 w-4" />
              <span>Candidature envoyée le {new Date(candidature.createdAt).toLocaleDateString('fr-FR')}</span>
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
                Voir le fichier joint
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center ml-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidature.status)}`}>
            <span className="mr-1">{getStatusIcon(candidature.status)}</span>
            {getStatusText(candidature.status)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MesCandidatures;
