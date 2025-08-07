// ========== FRONTEND (React Component) ==========
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

const CreerOffre = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domaine: '',      // ✅ AJOUTÉ - Champ obligatoire selon le modèle
    dateLimite: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Liste des domaines disponibles
  const domaines = [
    { value: 'informatique', label: 'Informatique' },
    { value: 'construction', label: 'Construction' },
    { value: 'services', label: 'Services' },
    { value: 'transport', label: 'Transport' },
    { value: 'sante', label: 'Santé' },
    { value: 'education', label: 'Éducation' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'energie', label: 'Énergie' },
    { value: 'autres', label: 'Autres' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation côté client
    if (!formData.title.trim()) {
      setError('Le titre est obligatoire');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('La description est obligatoire');
      setLoading(false);
      return;
    }

    if (!formData.domaine) {
      setError('Le domaine est obligatoire');
      setLoading(false);
      return;
    }

    if (!formData.dateLimite) {
      setError('La date limite est obligatoire');
      setLoading(false);
      return;
    }

    // Validation de la date
    const dateObj = new Date(formData.dateLimite);
    if (dateObj <= new Date()) {
      setError('La date limite doit être dans le futur');
      setLoading(false);
      return;
    }

    try {
      console.log('Données envoyées:', formData);

      // Récupérer le token depuis localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour créer une offre');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/offres', {
        title: formData.title,        // ✅ CORRIGÉ - Utilise "title" pas "titre"
        description: formData.description,
        domaine: formData.domaine,    // ✅ AJOUTÉ - Champ obligatoire
        dateLimite: formData.dateLimite
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Offre créée:', response.data);
      
      // Afficher un message de succès
      alert('Offre créée avec succès !');
      
      // Redirection après création
      navigate('/offres');
    } catch (error) {
      console.error('Erreur complète:', error);
      console.error('Réponse du serveur:', error.response?.data);
      
      if (error.response?.data?.details) {
        // Erreur de validation détaillée
        const details = error.response.data.details;
        if (Array.isArray(details)) {
          setError(`Erreurs de validation: ${details.map(d => d.message).join(', ')}`);
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError(error.response?.data?.message || 'Erreur lors de la création de l\'offre');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-2xl mx-auto p-6 transition-colors duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-lg mt-8`}>
        <h2 className={`text-3xl font-bold mb-6 text-center transition-colors ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Créer une nouvelle offre
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
        
          {/* Titre */}
          <div>
            <label className={`block mb-2 font-semibold transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Titre de l'offre *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Développement d'une application web"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block mb-2 font-semibold transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez en détail l'offre de marché public..."
              rows="5"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              required
            />
          </div>

          {/* Domaine */}
          <div>
            <label className={`block mb-2 font-semibold transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Domaine *
            </label>
            <select
              name="domaine"
              value={formData.domaine}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            >
              <option value="">Sélectionnez un domaine</option>
              {domaines.map(domaine => (
                <option key={domaine.value} value={domaine.value}>
                  {domaine.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date limite */}
          <div>
            <label className={`block mb-2 font-semibold transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Date limite de soumission *
            </label>
            <input
              type="date"
              name="dateLimite"
              value={formData.dateLimite}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]} // Empêche les dates passées
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
            } shadow-lg hover:shadow-xl`}
          >
            {loading ? 'Création en cours...' : 'Créer l\'offre'}
          </button>
        </form>

        {/* Affichage des erreurs */}
        {error && (
          <div className={`mt-4 p-4 rounded-lg border transition-colors ${
            darkMode
              ? 'bg-red-900/50 border-red-700 text-red-300'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <strong>Erreur:</strong> {error}
          </div>
        )}

        {/* Bouton retour */}
        <button
          type="button"
          onClick={() => navigate('/offres')}
          className={`mt-6 px-6 py-2 rounded-lg font-medium transition-colors ${
            darkMode
              ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
        >
          ← Retour à la liste des offres
        </button>

        {/* Informations d'aide */}
        <div className={`mt-8 p-6 rounded-lg border transition-colors ${
          darkMode
            ? 'bg-gray-700 border-gray-600'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h4 className={`font-bold mb-3 transition-colors ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Informations importantes :
          </h4>
          <ul className={`list-disc list-inside space-y-1 text-sm transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <li>Tous les champs marqués d'un * sont obligatoires</li>
            <li>La date limite doit être dans le futur</li>
            <li>La description doit être claire et détaillée</li>
            <li>Une fois créée, l'offre aura le statut "en_attente" jusqu'à validation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreerOffre;