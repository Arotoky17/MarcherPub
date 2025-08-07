import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaPaperPlane, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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
        const res = await axios.get(`${API_BASE_URL}/api/offres/${offerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffer(res.data.offre || res.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'offre:', err);
        setError("Impossible de charger l'offre.");
        setLoading(false);
      }
    };

    fetchOffer();
  }, [offerId, token]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Veuillez sélectionner un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('offerId', offerId);
    formData.append('file', file);
    if (message.trim()) {
      formData.append('message', message);
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/candidatures`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(res.data.message);
      setError('');
      // Navigation corrigée vers l'URL correcte
      navigate('/dashboard/dashboardentreprise');
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      setError(err.response?.data?.error || 'Erreur lors de la soumission.');
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <FaSpinner className={`animate-spin text-4xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center pt-10 text-red-600 font-semibold">
          {error}
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
        <div className="mb-6">
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {offer.title}
          </h3>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {offer.description}
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
            Publié le : {new Date(offer.createdAt).toLocaleDateString()}
          </p>
        </div>

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
              Joindre un document (tous formats acceptés) :
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
            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <FaPaperPlane /> Envoyer ma candidature
          </button>
        </form>

        {message && (
          <p className={`mt-4 font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {message}
          </p>
        )}
        {error && (
          <p className={`mt-4 font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Postuler;
