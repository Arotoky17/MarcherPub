import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaChartLine, 
  FaFileAlt, 
  FaUsers, 
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaBriefcase,
  FaUserTie,
  FaChartPie
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const EntrepriseHome = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Cards data
  const cards = [
    {
      path: "/dashboard/dashboardentreprise",
      icon: <FaChartPie className="text-indigo-600 dark:text-indigo-300 text-4xl mb-3" />,
      title: "Dashboard",
      description: "Tableau de bord complet avec statistiques",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
      borderColor: "border-indigo-200 dark:border-indigo-700"
    },
    {
      path: "/entreprise/offres-disponibles",
      icon: <FaBriefcase className="text-green-600 dark:text-green-400 text-4xl mb-3" />,
      title: "Offres",
      description: "Consulter les offres disponibles",
      bgColor: "bg-green-50 dark:bg-green-900/30",
      borderColor: "border-green-200 dark:border-green-700"
    },
    {
      path: "/entreprise/mescandidatures",
      icon: <FaUserTie className="text-purple-600 dark:text-purple-300 text-4xl mb-3" />,
      title: "Candidatures",
      description: "Suivi de vos candidatures",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      borderColor: "border-purple-200 dark:border-purple-700"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 p-6 relative"
    >
      {/* Header avec boutons */}
      <div className="flex justify-between items-center mb-10">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold text-blue-900 dark:text-white"
        >
          Espace <span className="text-blue-600 dark:text-blue-400">Entreprise</span>
        </motion.h1>
        
        <div className="flex items-center gap-4">
          {/* Bouton Mode Sombre/Clair */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
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
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            <FaSignOutAlt /> Déconnexion
          </motion.button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
              className={`block ${card.bgColor} border ${card.borderColor} rounded-2xl shadow-md p-8 transition-all duration-300 h-full flex flex-col items-center text-center`}
            >
              <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-full shadow-inner">
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">{card.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {card.description}
              </p>
              <motion.div 
                whileHover={{ x: 3 }}
                className="mt-6 text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center"
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
        <p>Session sécurisée • Connecté en tant que <span className="font-medium text-blue-600 dark:text-blue-400">
          {JSON.parse(localStorage.getItem('user'))?.username || 'Entreprise'}
        </span></p>
        <p className="mt-1">Dernière activité: {new Date().toLocaleString()}</p>
      </motion.div>
    </motion.div>
  );
};

export default EntrepriseHome;