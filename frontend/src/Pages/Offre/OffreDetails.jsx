// src/Pages/OffresEntreprise.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const OffresDetails = () => {
  const { darkMode } = useTheme();
  const [offres, setOffres] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await axios.get('/api/offres/validated');
      setOffres(res.data);
    } catch (err) {
      console.error('Erreur récupération offres', err);
    }
  };

  const handlePostuler = async () => {
    if (!message.trim()) return alert('Veuillez écrire un message pour votre candidature.');
    setPosting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/candidatures',
        { offreId: selectedOffer.id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg('Candidature envoyée avec succès !');
      setSelectedOffer(null);
      setMessage('');
    } catch (err) {
      alert('Erreur lors de l\'envoi de la candidature');
    }
    setPosting(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className={`text-3xl font-bold mb-6 text-center transition-colors ${
          darkMode ? 'text-indigo-300' : 'text-indigo-700'
        }`}>
          Offres Publiées
        </h1>

        {successMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-md mb-6 text-center transition-colors ${
              darkMode
                ? 'bg-green-900/50 text-green-300'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {successMsg}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offres.map(offer => (
            <motion.div
              key={offer.id}
              className={`p-4 border rounded-lg shadow cursor-pointer transition-colors ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedOffer(offer)}
            >
              <h2 className={`font-semibold text-lg transition-colors ${
                darkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                {offer.title}
              </h2>
              <p className={`line-clamp-3 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {offer.description}
              </p>
              <p className={`mt-2 text-sm transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Date limite : {new Date(offer.dateLimite).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>

        {selectedOffer && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOffer(null)}
          >
            <motion.div
              className={`rounded-lg p-6 max-w-lg w-full relative transition-colors ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={e => e.stopPropagation()}
              initial={{ y: 50 }}
              animate={{ y: 0 }}
            >
              <h3 className={`text-xl font-bold mb-4 transition-colors ${
                darkMode ? 'text-indigo-400' : 'text-indigo-700'
              }`}>
                {selectedOffer.title}
              </h3>
              <p className={`mb-4 transition-colors ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {selectedOffer.description}
              </p>

              <textarea
                rows={4}
                placeholder="Votre message de candidature..."
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 transition-colors ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setSelectedOffer(null)}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    darkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Annuler
                </button>
                <button
                  onClick={handlePostuler}
                  disabled={posting}
                  className={`px-4 py-2 rounded-md text-white transition-colors ${
                    posting
                      ? 'bg-indigo-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {posting ? 'Envoi...' : 'Postuler'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OffresDetails;
