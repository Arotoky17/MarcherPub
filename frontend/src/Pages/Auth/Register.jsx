import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Inscription échouée');
      }

      setSuccess('✅ Inscription réussie ! Redirection en cours...');
      setTimeout(() => navigate('/'), 2000);
      
    } catch (err) {
      setError(err.message || 'Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 relative transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Bouton Mode Sombre */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition-colors ${
          darkMode
            ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
      </button>

      {/* Bouton Retour à l'accueil */}
      <Link
        to="/"
        className={`absolute top-6 left-6 flex items-center gap-2 transition-colors duration-200 px-3 py-2 rounded-lg shadow-md hover:shadow-lg ${
          darkMode
            ? 'text-sky-400 hover:text-sky-300 bg-gray-800/80 hover:bg-gray-800'
            : 'text-sky-600 hover:text-sky-800 bg-white/80 hover:bg-white'
        }`}
      >
        <FaHome className="h-4 w-4" />
        <span className="text-sm font-medium">Accueil</span>
      </Link>

      <form
        onSubmit={handleRegister}
        className={`p-6 rounded-xl shadow-2xl w-full max-w-md transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h2 className={`text-3xl font-semibold mb-6 text-center transition-colors ${
          darkMode ? 'text-sky-400' : 'text-sky-600'
        }`}>
          Créer un compte entreprise
        </h2>

        {error && (
          <div className={`px-4 py-3 rounded mb-4 text-sm border transition-colors ${
            darkMode
              ? 'bg-red-900/50 border-red-700 text-red-300'
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {success && (
          <div className={`px-4 py-3 rounded mb-4 text-sm border transition-colors ${
            darkMode
              ? 'bg-green-900/50 border-green-700 text-green-300'
              : 'bg-green-100 border-green-400 text-green-700'
          }`}>
            {success}
          </div>
        )}

        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Nom d'utilisateur</label>
          <input
            name="username"
            onChange={handleChange}
            required
            placeholder="Ex: entrepriseX"
            className={`w-full p-2 rounded border focus:outline-none focus:ring-1 focus:ring-sky-400 text-sm transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Email</label>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            required
            placeholder="exemple@mail.com"
            className={`w-full p-2 rounded border focus:outline-none focus:ring-1 focus:ring-sky-400 text-sm transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Nom de l'entreprise</label>
          <input
            name="companyName"
            onChange={handleChange}
            placeholder="Entreprise S.A."
            className={`w-full p-2 rounded border focus:outline-none focus:ring-1 focus:ring-sky-400 text-sm transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        <div className="mb-6">
          <label className={`block text-sm font-medium mb-1 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Mot de passe</label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            required
            placeholder="******"
            className={`w-full p-2 rounded border focus:outline-none focus:ring-1 focus:ring-sky-400 text-sm transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded transition duration-300 flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Inscription...
            </>
          ) : "S'inscrire"}
        </button>

        <div className="text-center mt-4 text-sm">
          <p className={`transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Déjà un compte ?{' '}
            <a
              href="/login"
              className={`underline transition duration-200 ${
                darkMode
                  ? 'text-sky-400 hover:text-sky-300'
                  : 'text-sky-600 hover:text-sky-800'
              }`}
            >
              Se connecter
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;