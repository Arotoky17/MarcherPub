import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaPaperPlane, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://marcherpub.onrender.com';

const Postuler = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { darkMode, setDarkMode } = useTheme();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        // Debug: Log the offerId and token
        console.log('Fetching offer with ID:', offerId);
        console.log('Token exists:', !!token);
        
        // Validate offerId
        if (!offerId || offerId === 'undefined' || offerId === 'null') {
          throw new Error('ID de l\'offre invalide');
        }

        // Validate token
        if (!token) {
          throw new Error('Token d\'authentification manquant');
        }

        const res = await axios.get(`${API_BASE_URL}/offres/${offerId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        console.log('API Response:', res.data);
        setOffer(res.data.offre || res.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur complète:', err);
        console.error('Response data:', err.response?.data);
        console.error('Response status:', err.response?.status);
        
        let errorMessage = "Impossible de charger l'offre.";
        
        if (err.response?.status === 400) {
          errorMessage = "Requête invalide - Vérifiez l'ID de l'offre.";
        } else if (err.response?.status === 401) {
          errorMessage = "Session expirée. Veuillez vous reconnecter.";
          // Redirect to login
          localStorage.removeItem('token');
          navigate('/login');
          return;
        } else if (err.response?.status === 404) {
          errorMessage = "Cette offre n'existe pas ou a été supprimée.";
        } else if (err.response?.status === 500) {
          errorMessage = "Erreur du serveur. Veuillez réessayer plus tard.";
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchOffer();
  }, [offerId, token, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file size (limit to 10MB)
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setError('Le fichier ne doit pas dépasser 10MB.');
      return;
    }
    
    setFile(selectedFile);
    setError(''); // Clear any previous errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Veuillez sélectionner un fichier.');
      return;
    }

    if (!token) {
      setError('Session expirée. Veuillez vous reconnecter.');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('offerId', offerId);
    formData.append('file', file);
    if (message.trim()) {
      formData.append('message', message.trim());
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/candidatures`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Candidature response:', res.data);
      setMessage('Candidature envoyée avec succès !');
      setError('');
      
      // Wait a bit before redirecting to show success message
      setTimeout(() => {
        navigate('/dashboard/dashboardentreprise');
      }, 2000);
      
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      console.error('Response data:', err.response?.data);
      
      let errorMessage = 'Erreur lors de la soumission.';
      
      if (err.response?.status === 400) {
        errorMessage = err.response.data?.error || 'Données invalides.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        localStorage.removeItem('token');
        navigate('/login');
        return;
      } else if (err.response?.status === 409) {
        errorMessage = 'Vous avez déjà postulé à cette offre.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <FaSpinner className={`animate-spin text-4xl mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <p className={darkMode ? 'text-white' : 'text-gray-800'}>Chargement de l'offre...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !offer) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-10`}>
        <div className="max-w-2xl mx-auto p-6">
          <div className={`text-center p-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Erreur
            </h2>
            <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {error}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Réessayer
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Retour au tableau de bord
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-10`}>
      {/* Toggle Mode Sombre */}
      <div className="fixed top-4 right-4 z-10">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full shadow-lg transition-colors ${
            darkMode
              ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
        </button>
      </div>

      <div className={`max-w-2xl mx-auto p-6 shadow-md rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Postuler à l'offre
        </h2>
        
        {offer && (
          <div className="mb-6">
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {offer.title}
            </h3>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {offer.description}
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Publié le : {new Date(offer.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Message de motivation (optionnel) :
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full p-3 border rounded-lg transition-colors ${
                darkMode
                  ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-400'
                  : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
              }`}
              rows="4"
              placeholder="Décrivez vos motivations pour cette offre..."
            />
          </div>

          <div className="mb-4">
            <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Joindre un document (tous formats acceptés, max 10MB) :
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              required
              className={`w-full border p-2 rounded transition-colors ${
                darkMode
                  ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-400'
                  : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
            {loading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
          </button>
        </form>

        {message && !error && (
          <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
            <p className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              ✅ {message}
            </p>
          </div>
        )}
        
        {error && offer && (
          <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-red-900' : 'bg-red-100'}`}>
            <p className={`font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              ❌ {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Postuler;