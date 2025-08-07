import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaChartLine, 
  FaUsers, 
  FaPlusCircle, 
  FaSignOutAlt,
  FaFileContract,
  FaClipboardList,
  FaChartPie,
  FaUserCog,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

const MinistereHome = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Vérification du thème au chargement
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle du mode sombre
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      if (authLoading) return;

      setIsVerifying(true);
      try {
        const token = localStorage.getItem('token');
        
        if (!token || !['ministere', 'admin', 'ministerepublique'].includes(user?.role)) {
          throw new Error('Accès non autorisé');
        }

        await axios.get('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error('Erreur de vérification:', error);
        logout();
        navigate('/login', { replace: true });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [user, logout, navigate, authLoading]);

  if (authLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400 rounded-full"
        />
      </div>
    );
  }

  // Cards data with improved styling
  const cards = [
    {
      path: "/dashboard/DashboardMinistere",
      icon: <FaChartPie className="text-indigo-600 dark:text-indigo-300 text-4xl mb-3" />,
      title: "Dashboard",
      description: "Statistiques et analyses des marchés",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
      borderColor: "border-indigo-200 dark:border-indigo-700"
    },
    {
      path: "/ministere/creer-offre-nouveau",
      icon: <FaFileContract className="text-green-600 dark:text-green-400 text-4xl mb-3" />,
      title: "Créer Offre",
      description: "Publier un nouveau marché public",
      bgColor: "bg-green-50 dark:bg-green-900/30",
      borderColor: "border-green-200 dark:border-green-700"
    },
    {
      path: "/ministere/gestion-offres",
      icon: <FaClipboardList className="text-blue-600 dark:text-blue-400 text-4xl mb-3" />,
      title: "Gérer Offres",
      description: "Valider et gérer les offres",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      borderColor: "border-blue-200 dark:border-blue-700"
    },
    {
      path: "/ministere/GestionCandidatures",
      icon: <FaUsers className="text-purple-600 dark:text-purple-300 text-4xl mb-3" />,
      title: "Candidatures par Offre",
      description: "Gérer les candidatures par offre",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      borderColor: "border-purple-200 dark:border-purple-700"
    },
    {
      path: "/ministere/gestion-candidatures-toutes",
      icon: <FaUserCog className="text-orange-600 dark:text-orange-300 text-4xl mb-3" />,
      title: "Toutes Candidatures",
      description: "Vue globale des candidatures",
      bgColor: "bg-orange-50 dark:bg-orange-900/30",
      borderColor: "border-orange-200 dark:border-orange-700"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 p-6 relative"
    >
      {/* Header avec boutons */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-900 dark:text-white">
          Espace <span className="text-indigo-600 dark:text-indigo-400">Ministère</span>
        </h1>
        
        <div className="flex items-center gap-4">
          {/* Bouton Mode Sombre/Clair */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
          </motion.button>
          
          {/* Bouton Déconnexion */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={logout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            <FaSignOutAlt /> Déconnexion
          </motion.button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ 
              y: -5,
              scale: 1.03,
              boxShadow: darkMode 
                ? "0 10px 25px -5px rgba(0, 0, 0, 0.25)" 
                : "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={card.path}
              className={`block ${card.bgColor} border ${card.borderColor} rounded-2xl shadow-md p-6 transition-all duration-300 h-full flex flex-col items-center text-center`}
            >
              <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-full shadow-inner">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{card.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow">
                {card.description}
              </p>
              <motion.div 
                whileHover={{ x: 3 }}
                className="mt-4 text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center"
              >
                Accéder <span className="ml-1">→</span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-6"
      >
        <p>Session sécurisée • Connecté en tant que <span className="font-medium text-indigo-600 dark:text-indigo-400">{user?.username}</span></p>
        <p className="mt-1">Dernière activité: {new Date().toLocaleString()}</p>
      </motion.div>
    </motion.div>
  );
};

export default MinistereHome;