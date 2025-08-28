import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const CreerOffreNouveau = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domaine: '',
    dateLimite: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Liste complète des domaines disponibles
  const domaines = [
    { value: 'informatique', label: '💻 Informatique & Technologies' },
    { value: 'construction', label: '🏗️ Construction & BTP' },
    { value: 'services', label: '🤝 Services & Consulting' },
    { value: 'transport', label: '🚛 Transport & Logistique' },
    { value: 'sante', label: '🏥 Santé & Médical' },
    { value: 'education', label: '📚 Éducation & Formation' },
    { value: 'agriculture', label: '🌾 Agriculture & Agro-alimentaire' },
    { value: 'energie', label: '⚡ Énergie & Environnement' },
    { value: 'finance', label: '💰 Finance & Banque' },
    { value: 'communication', label: '📡 Communication & Médias' },
    { value: 'securite', label: '🔒 Sécurité & Défense' },
    { value: 'industrie', label: '🏭 Industrie & Manufacturing' },
    { value: 'autres', label: '📂 Autres' }
  ];

  // Vérification de l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour accéder à cette page');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Réinitialiser les messages d'erreur lors de la saisie
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    // Validation des champs obligatoires
    if (!formData.title.trim()) {
      return 'Le titre de l\'offre est obligatoire';
    }
    if (formData.title.trim().length < 5) {
      return 'Le titre doit contenir au moins 5 caractères';
    }
    
    if (!formData.description.trim()) {
      return 'La description est obligatoire';
    }
    if (formData.description.trim().length < 20) {
      return 'La description doit contenir au moins 20 caractères';
    }
    
    if (!formData.domaine) {
      return 'Veuillez sélectionner un domaine';
    }
    
    if (!formData.dateLimite) {
      return 'La date limite est obligatoire';
    }

    // Validation de la date
    const dateObj = new Date(formData.dateLimite);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time pour comparaison précise
    
    if (dateObj <= today) {
      return 'La date limite doit être dans le futur (au moins demain)';
    }

    // Vérifier que la date n'est pas trop loin dans le futur (par exemple, max 2 ans)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);
    if (dateObj > maxDate) {
      return 'La date limite ne peut pas dépasser 2 ans';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation côté client
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Récupérer le token d'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expirée. Veuillez vous reconnecter.');
        setTimeout(() => navigate('/login'), 1500);
        setLoading(false);
        return;
      }

      console.log('🚀 Envoi de la requête de création d\'offre:', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        domaine: formData.domaine,
        dateLimite: formData.dateLimite
      });

      // Utiliser l'URL complète du backend
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      
      // Appel API avec les données correctes
      const response = await axios.post(`${API_BASE_URL}/api/offres`, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        domaine: formData.domaine,
        dateLimite: formData.dateLimite
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Offre créée avec succès:', response.data);
      
      setSuccess(response.data.message || 'Offre créée avec succès !');
      
      // Réinitialiser le formulaire
      setFormData({
        title: '',
        description: '',
        domaine: '',
        dateLimite: '',
      });

      // Redirection après 2 secondes
      setTimeout(() => {
        navigate('/ministere/home');
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur complète lors de la création:', error);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Response status:', error.response?.status);
      console.error('❌ Response headers:', error.response?.headers);
      
      if (error.response?.status === 401) {
        setError('Session expirée. Redirection vers la page de connexion...');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 1500);
      } else if (error.response?.status === 403) {
        setError('Accès refusé. Vous devez être du ministère pour créer une offre.');
      } else if (error.response?.status === 404) {
        setError('API non trouvée. Vérifiez que le serveur backend est démarré.');
      } else if (error.response?.status === 500) {
        setError(`Erreur serveur: ${error.response?.data?.message || error.response?.data?.error || 'Erreur interne'}`);
      } else if (error.response?.data?.message) {
        setError(`Erreur API: ${error.response.data.message}`);
      } else if (error.response?.data?.missing) {
        const missing = error.response.data.missing;
        const missingFields = Object.keys(missing).filter(field => missing[field]);
        setError(`Champs manquants: ${missingFields.join(', ')}`);
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le bon port.');
      } else {
        setError(`Erreur détaillée: ${error.message} | Status: ${error.response?.status || 'N/A'} | Data: ${JSON.stringify(error.response?.data || {})}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculer la date minimum (demain)
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Calculer la date maximum (2 ans)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className={`min-h-screen py-8 transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-gray-900 to-gray-800'
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 transition-colors ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            📋 Créer une Nouvelle Offre
          </h1>
          <p className={`transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Publiez un appel d'offres public pour les entreprises
          </p>
        </div>

        {/* Formulaire principal */}
        <div className={`rounded-xl shadow-lg p-8 transition-colors ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Titre de l'offre */}
            <div>
              <label className={`block text-sm font-semibold mb-2 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                🏷️ Titre de l'offre *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Développement d'une plateforme web de gestion des marchés publics"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                maxLength="255"
                required
              />
              <div className={`text-right text-sm mt-1 transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {formData.title.length}/255 caractères
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-semibold mb-2 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                📝 Description détaillée *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez en détail les spécifications de l'offre, les exigences techniques, les livrables attendus, les critères d'évaluation..."
                rows="6"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                maxLength="2000"
                required
              />
              <div className={`text-right text-sm mt-1 transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {formData.description.length}/2000 caractères
              </div>
            </div>

            {/* Domaine */}
            <div>
              <label className={`block text-sm font-semibold mb-2 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                🎯 Domaine d'activité *
              </label>
              <select
                name="domaine"
                value={formData.domaine}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              >
                <option value="">-- Sélectionnez un domaine --</option>
                {domaines.map(domaine => (
                  <option key={domaine.value} value={domaine.value}>
                    {domaine.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date limite */}
            <div>
              <label className={`block text-sm font-semibold mb-2 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                📅 Date limite de soumission *
              </label>
              <input
                type="date"
                name="dateLimite"
                value={formData.dateLimite}
                onChange={handleChange}
                min={getTomorrowDate()}
                max={getMaxDate()}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
              <div className={`text-sm mt-1 transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                La date doit être au minimum demain et au maximum dans 2 ans
              </div>
            </div>

            {/* Messages d'état */}
            {error && (
              <div className={`border rounded-lg p-4 transition-colors ${
                darkMode
                  ? 'bg-red-900/50 border-red-700'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center">
                  <div className="text-red-400 mr-3">❌</div>
                  <div className={`font-medium transition-colors ${
                    darkMode ? 'text-red-300' : 'text-red-800'
                  }`}>
                    {error}
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className={`border rounded-lg p-4 transition-colors ${
                darkMode
                  ? 'bg-green-900/50 border-green-700'
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center">
                  <div className="text-green-400 mr-3">✅</div>
                  <div className={`font-medium transition-colors ${
                    darkMode ? 'text-green-300' : 'text-green-800'
                  }`}>
                    {success}
                  </div>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'
                } text-white shadow-lg`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Création en cours...
                  </>
                ) : (
                  <>
                    📤 Créer l'offre
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/ministere/home')}
                disabled={loading}
                className={`flex-1 sm:flex-initial px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200 active:transform active:scale-95 shadow-lg ${
                  darkMode
                    ? 'bg-gray-600 hover:bg-gray-700'
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                ← Retour
              </button>
            </div>
          </form>
        </div>

        {/* Informations d'aide */}
        <div className={`mt-8 border rounded-lg p-6 transition-colors ${
          darkMode
            ? 'bg-gray-800 border-gray-600'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors ${
            darkMode ? 'text-white' : 'text-blue-800'
          }`}>
            ℹ️ Informations importantes
          </h3>
          <div className={`grid md:grid-cols-2 gap-4 text-sm transition-colors ${
            darkMode ? 'text-gray-300' : 'text-blue-700'
          }`}>
            <div>
              <h4 className="font-semibold mb-2">📋 Processus de validation</h4>
              <ul className="space-y-1">
                <li>• L'offre aura le statut "en_attente" après création</li>
                <li>• Elle sera visible par les entreprises une fois validée</li>
                <li>• Les entreprises pourront postuler jusqu'à la date limite</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✅ Bonnes pratiques</h4>
              <ul className="space-y-1">
                <li>• Soyez précis dans la description</li>
                <li>• Définissez clairement les livrables</li>
                <li>• Prévoyez une date limite réaliste</li>
                <li>• Mentionnez les critères d'évaluation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreerOffreNouveau;