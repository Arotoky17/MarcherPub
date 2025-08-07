// Extrait dans OffresEntreprise.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

const OffresEntreprise = () => {
  const { darkMode } = useTheme();
  const [offres, setOffres] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const res = await axios.get(`${API_BASE_URL}/api/offres/published`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOffres(res.data.offres || res.data);
      } catch (error) {
        console.error('Erreur récupération offres:', error);
      }
    };
    fetchOffres();
  }, [token]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-4xl mx-auto p-6 transition-colors ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-lg mt-8`}>
        <h2 className={`text-3xl font-bold mb-6 text-center transition-colors ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Offres disponibles
        </h2>
        
        {offres.length === 0 ? (
          <p className={`text-center py-8 transition-colors ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Aucune offre disponible pour le moment.
          </p>
        ) : (
          <div className="space-y-6">
            {offres.map((offre) => (
              <div
                key={offre.id}
                className={`p-6 rounded-lg border transition-colors ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } shadow-md hover:shadow-lg`}
              >
                <h3 className={`text-xl font-semibold mb-3 transition-colors ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {offre.title}
                </h3>
                <p className={`mb-4 transition-colors ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {offre.description}
                </p>
                <button className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } shadow-md hover:shadow-lg`}>
                  Postuler
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffresEntreprise;
