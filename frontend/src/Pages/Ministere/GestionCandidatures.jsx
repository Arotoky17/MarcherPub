import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFileAlt, FaCheck, FaTimes, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Récupérer toutes les candidatures via le dashboard
        const res = await axios.get(`${API_BASE_URL}/api/dashboard/ministere`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log('📋 Candidatures récupérées:', res.data.candidatures);
        setCandidatures(res.data.candidatures || []);
      } catch (err) {
        console.error('❌ Erreur lors du chargement des candidatures:', err);
        setError(err.response?.data?.error || 'Erreur lors du chargement des candidatures');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidatures();
  }, []);

  // Calculer les statistiques
  const stats = {
    total: candidatures.length,
    enAttente: candidatures.filter(c => c.status === 'en_attente').length,
    acceptees: candidatures.filter(c => c.status === 'acceptée').length,
    rejetees: candidatures.filter(c => c.status === 'rejetée').length
  };

  const handleStatusUpdate = async (candidatureId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      console.log('🔄 Mise à jour statut:', { candidatureId, newStatus });
      
      const res = await axios.patch(`${API_BASE_URL}/api/candidatures/${candidatureId}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Statut mis à jour:', res.data);
      
      // Mettre à jour la liste locale
      setCandidatures(prev => prev.map(c =>
        c.id === candidatureId ? { ...c, status: newStatus } : c
      ));
      
      alert(`Candidature ${newStatus === 'acceptée' ? 'acceptée' : 'rejetée'} avec succès`);
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour du statut:', err);
      alert(err.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  };

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <p className={`text-center text-xl animate-pulse transition-colors ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        Chargement des candidatures...
      </p>
    </div>
  );
  
  if (error) return (
    <div className={`min-h-screen flex items-center justify-center transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <p className={`text-center font-semibold transition-colors ${
        darkMode ? 'text-red-400' : 'text-red-600'
      }`}>
        {error}
      </p>
    </div>
  );

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100'
        : 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-900'
    }`}>
      <h1 className={`text-4xl font-extrabold mb-8 text-center drop-shadow-lg transition-colors ${
        darkMode ? 'text-indigo-300' : 'text-indigo-700'
      }`}>
        Gestion des Candidatures
      </h1>

      {/* Statistiques */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-6">
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
            darkMode ? 'bg-yellow-900' : 'bg-yellow-50'
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
            darkMode ? 'bg-green-900' : 'bg-green-50'
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
            darkMode ? 'bg-red-900' : 'bg-red-50'
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
        <p className={`text-center text-lg transition-colors ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Aucune candidature reçue pour le moment.
        </p>
      ) : (
        <div className={`overflow-x-auto rounded-lg shadow-lg transition-colors ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <table className={`min-w-full border-collapse border transition-colors ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <thead>
              <tr className={`font-semibold transition-colors ${
                darkMode
                  ? 'bg-indigo-900 text-indigo-300'
                  : 'bg-indigo-100 text-indigo-800'
              }`}>
                <th className={`p-4 border transition-colors ${
                  darkMode ? 'border-indigo-700' : 'border-indigo-200'
                }`}>Entreprise</th>
                <th className={`p-4 border transition-colors ${
                  darkMode ? 'border-indigo-700' : 'border-indigo-200'
                }`}>Message</th>
                <th className={`p-4 border transition-colors ${
                  darkMode ? 'border-indigo-700' : 'border-indigo-200'
                }`}>Date</th>
                <th className={`p-4 border transition-colors ${
                  darkMode ? 'border-indigo-700' : 'border-indigo-200'
                }`}>Fichier</th>
                <th className={`p-4 border transition-colors ${
                  darkMode ? 'border-indigo-700' : 'border-indigo-200'
                }`}>Statut</th>
                <th className={`p-4 border transition-colors ${
                  darkMode ? 'border-indigo-700' : 'border-indigo-200'
                }`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidatures.map((c, index) => (
                <motion.tr
                  key={c.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className={`border-t transition-colors cursor-pointer ${
                    darkMode
                      ? 'border-indigo-700 hover:bg-indigo-800'
                      : 'border-indigo-200 hover:bg-indigo-50'
                  }`}
                >
                  <td className={`p-4 border transition-colors ${
                    darkMode ? 'border-indigo-700' : 'border-indigo-200'
                  }`}>
                    ID: {c.entrepriseId || 'Inconnu'}
                  </td>
                  <td className={`p-4 border transition-colors ${
                    darkMode ? 'border-indigo-700' : 'border-indigo-200'
                  }`}>
                    {c.message || 'Aucun message'}
                  </td>
                  <td className={`p-4 border transition-colors ${
                    darkMode ? 'border-indigo-700' : 'border-indigo-200'
                  }`}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className={`p-4 border transition-colors ${
                    darkMode ? 'border-indigo-700' : 'border-indigo-200'
                  }`}>
                    {c.fileUrl ? (
                      <a
                        href={`${API_BASE_URL}${c.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded transition-colors ${
                          darkMode
                            ? 'bg-indigo-700 hover:bg-indigo-600 text-indigo-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                        title="Télécharger le fichier"
                      >
                        <FaDownload className="text-sm" />
                        Fichier
                      </a>
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
                      c.status === 'en_attente'
                        ? (darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800')
                        : c.status === 'acceptée'
                        ? (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                        : (darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className={`p-4 border transition-colors ${
                    darkMode ? 'border-indigo-700' : 'border-indigo-200'
                  }`}>
                    {c.status === 'en_attente' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(c.id, 'acceptée')}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                          title="Accepter la candidature"
                        >
                          <FaCheck className="text-sm" />
                          Accepter
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(c.id, 'rejetée')}
                          className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                          title="Rejeter la candidature"
                        >
                          <FaTimes className="text-sm" />
                          Rejeter
                        </button>
                      </div>
                    ) : (
                      <span className={`text-sm italic transition-colors ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Traitée
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GestionCandidatures;
