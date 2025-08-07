// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { darkMode, setDarkMode } = useTheme();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <nav className={`${
      darkMode
        ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700'
        : 'bg-indigo-900/70 backdrop-blur-md'
    } text-white p-4 px-8 flex justify-between items-center shadow-lg sticky top-0 z-50 transition-all duration-300`}>
      <Link to="/" className="flex items-center space-x-3 group">
        <div className={`p-2 rounded-lg ${
          darkMode
            ? 'bg-blue-600/20 group-hover:bg-blue-600/30'
            : 'bg-white/10 group-hover:bg-white/20'
        } transition-all duration-200`}>
          <img
            src="/image/ICON.PNG"
            alt="Logo"
            className="w-6 h-6 object-contain"
          />
        </div>
        <h1 className={`text-xl font-bold tracking-tight group-hover:scale-105 transition-transform duration-200 ${
          darkMode ? 'text-blue-200' : 'text-white'
        }`}>
          Marchés Publics
        </h1>
      </Link>

      <div className="flex gap-4 items-center">
        {/* Indicateur du mode actuel */}
        <div className={`hidden sm:flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          darkMode
            ? 'bg-gray-800 text-gray-300 border border-gray-600'
            : 'bg-white/10 text-blue-100 border border-white/20'
        } transition-all duration-200`}>
          {darkMode ? (
            <>
              <FaMoon className="w-3 h-3 mr-1" />
              Mode sombre
            </>
          ) : (
            <>
              <FaSun className="w-3 h-3 mr-1" />
              Mode clair
            </>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.button
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500'
                : 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40'
            } hover:shadow-lg`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? (
              <motion.span
                key="sun"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <FaSun className="text-yellow-400 text-lg" />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.3 }}
              >
                <FaMoon className="text-blue-100 text-lg" />
              </motion.span>
            )}
          </motion.button>
        </AnimatePresence>

        <Link
          to="/login"
          className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 hover:border-blue-400'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40'
          }`}
        >
          Connexion
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;