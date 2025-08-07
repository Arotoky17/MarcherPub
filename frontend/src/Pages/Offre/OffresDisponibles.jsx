import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaCalendarAlt, FaBuilding, FaArrowLeft, FaSearch, FaFilter } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const OffresDisponibles = () => {
  const { darkMode } = useTheme();
  const [offres, setOffres] = useState([]);
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [domains, setDomains] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/offres/published`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des offres');
        }
        
        const data = await response.json();
        const offers = data.offres || [];
        setOffres(offers);
        setFilteredOffres(offers);
        
        // Extraire les domaines uniques
        const uniqueDomains = [...new Set(offers.map(offer => offer.domaine))];
        setDomains(uniqueDomains);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffres();
  }, []);

  // Fonction de filtrage
  useEffect(() => {
    let filtered = offres;

    if (searchTerm) {
      filtered = filtered.filter(offre =>
        offre.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDomain) {
      filtered = filtered.filter(offre => offre.domaine === selectedDomain);
    }

    setFilteredOffres(filtered);
  }, [searchTerm, selectedDomain, offres]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Chargement des offres...</p>
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
                Offres Disponibles
              </h1>
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {filteredOffres.length} sur {offres.length} offre{offres.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Rechercher des offres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            {/* Domain Filter */}
            <div className="sm:w-64">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Tous les domaines</option>
                {domains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredOffres.length === 0 ? (
          <div className="text-center py-12">
            <FaBuilding className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {offres.length === 0 ? 'Aucune offre disponible' : 'Aucun résultat'}
            </h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {offres.length === 0
                ? 'Il n\'y a actuellement aucune offre publiée.'
                : 'Essayez de modifier vos critères de recherche.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOffres.map((offre) => (
              <OffreCard key={offre.id} offre={offre} darkMode={darkMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour chaque offre
const OffreCard = ({ offre, darkMode }) => {
  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const expired = isExpired(offre.dateLimite);

  return (
    <div className={`rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } ${expired ? 'opacity-75' : ''}`}>
      <div className="p-6">
        {/* Status Badge */}
        <div className="flex justify-between items-start mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            expired
              ? darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
              : darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
          }`}>
            {expired ? 'Expirée' : 'Disponible'}
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {offre.title}
        </h3>

        {/* Domain */}
        <p className={`text-sm font-medium mb-3 ${
          darkMode ? 'text-blue-400' : 'text-blue-600'
        }`}>
          {offre.domaine}
        </p>

        {/* Description */}
        <p className={`text-sm mb-4 line-clamp-3 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {offre.description}
        </p>

        {/* Date limite */}
        <div className={`flex items-center text-sm mb-4 ${
          expired
            ? 'text-red-500'
            : darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <FaCalendarAlt className="mr-2 h-4 w-4" />
          <span>Date limite: {formatDate(offre.dateLimite)}</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Link
            to={`/offre/${offre.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
          >
            <FaEye className="mr-2 h-4 w-4" />
            Voir détails
          </Link>
          
          {!expired && (
            <Link
              to={`/entreprise/postuler/${offre.id}`}
              className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Postuler
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OffresDisponibles;