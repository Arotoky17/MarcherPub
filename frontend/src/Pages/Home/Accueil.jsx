import React, { useEffect, useState } from 'react';
import { FaBullseye, FaFileAlt, FaUsers, FaSearch, FaHandshake, FaChartLine, FaGlobe } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Navbar from '../../Components/Navbar';

// Animations
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Home = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const fetchPublishedOffers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/offres/publiees');
        setOffers(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des offres", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublishedOffers();

    // Écouter les changements de thème
    const root = window.document.documentElement;
    const observer = new MutationObserver(() => {
      setDarkMode(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const filteredOffers = offers.filter(offer =>
    offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Classes conditionnelles basées sur le mode sombre
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-blue-100';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const cardBgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const headerBgClass = darkMode ? 'bg-gray-800' : 'bg-blue-900';
  const sectionBgClass = darkMode ? 'bg-gray-800' : 'bg-blue-50';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgClass} ${textClass}`}>
      

      {/* Header */}
      <motion.header 
        initial="hidden"
        animate="show"
        variants={fadeIn}
        className={`relative p-8 text-center mt-6 min-h-[400px] flex flex-col items-center justify-center 
                   ${headerBgClass} overflow-hidden border-white rounded-xl`}
      >
        {/* Image de fond avec filtre + overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="./image/AA.jpg" 
            className="w-full h-full object-cover object-center brightness-110"
            alt="Bannière marchés publics"
          />
          <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900/70' : 'bg-blue-600/60'} mix-blend-multiply`}></div>
        </div>

        {/* Contenu texte */}
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.h1 
            variants={slideUp}
            className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg"
          >
            Plateforme des Marchés Publics
          </motion.h1>
          <motion.p 
            variants={slideUp}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl max-w-3xl mx-auto text-blue-100 dark:text-blue-200 drop-shadow-md"
          >
            Transparence et efficacité dans la gestion des marchés publics
          </motion.p>

          {/* Bouton CTA animé */}
          <motion.div
            variants={slideUp}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <a 
              href="#offres"
              className={`inline-block ${darkMode ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' : 'bg-white text-blue-800 hover:bg-blue-100'} font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300`}
            >
              Explorer les offres
            </a>
          </motion.div>
        </div>

        {/* Vague décorative animée */}
        <div className="absolute bottom-0 left-0 right-0 animate-waveMotion">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-30">
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              opacity=".25" 
              className={darkMode ? 'fill-gray-100/20' : 'fill-white/50'}
            />
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              opacity=".5" 
              className={darkMode ? 'fill-gray-100/40' : 'fill-white/60'}
            />
            <path 
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
              className={darkMode ? 'fill-gray-200' : 'fill-white'}
            />
          </svg>
        </div>
      </motion.header>

      {/* Section Missions */}
      <motion.section 
        initial="hidden"
        animate="show"
        variants={container}
        className={`py-16 px-6 md:px-20 ${sectionBgClass}`}
      >
        <motion.h2 
          variants={item}
          className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-blue-800'} border-b-2 ${darkMode ? 'border-gray-700' : 'border-blue-200'} pb-4`}
        >
          Nos Missions Prioritaires
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Case 1 - Régulation */}
          <motion.div 
            variants={item}
            className={`${cardBgClass} p-8 rounded-lg shadow-sm border-l-4 ${darkMode ? 'border-blue-500' : 'border-blue-600'} hover:shadow-md transition-all h-full flex flex-col`}
            whileHover={{ y: -5 }}
          >
            <motion.div 
              className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}
              animate={{
                rotate: [0, 5, -5, 0],
                transition: { 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              }}
            >
              <motion.svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{
                  scale: [1, 1.1, 1],
                  transition: { 
                    duration: 4,
                    repeat: Infinity 
                  }
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </motion.svg>
            </motion.div>
            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Régulation des Marchés</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} flex-grow`}>
              Supervision et contrôle des procédures d'appels d'offres publics pour garantir l'équité
            </p>
            {/* <motion.a 
              href="/regulation" 
              className={`mt-4 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium inline-flex items-center`}
              whileHover={{ x: 3 }}
            >
              En savoir plus <ChevronRightIcon className="w-4 h-4 ml-1" />
            </motion.a> */}
          </motion.div>

          {/* Case 2 - Transparence */}
          <motion.div 
            variants={item}
            className={`${cardBgClass} p-8 rounded-lg shadow-sm border-l-4 ${darkMode ? 'border-green-500' : 'border-green-600'} hover:shadow-md transition-all h-full flex flex-col`}
            whileHover={{ y: -5 }}
          >
            <motion.div 
              className={`${darkMode ? 'bg-green-900' : 'bg-green-100'} w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${darkMode ? 'text-green-300' : 'text-green-600'}`}
              animate={{
                y: [0, -3, 0],
                transition: { 
                  duration: 3,
                  repeat: Infinity
                }
              }}
            >
              <motion.svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{
                  opacity: [1, 0.8, 1],
                  transition: { 
                    duration: 3,
                    repeat: Infinity
                  }
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </motion.svg>
            </motion.div>
            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Transparence</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} flex-grow`}>
              Publication systématique des données essentielles pour une gouvernance ouverte
            </p>
            {/* <motion.a 
              href="/transparence" 
              className={`mt-4 ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'} font-medium inline-flex items-center`}
              whileHover={{ x: 3 }}
            >
              En savoir plus <ChevronRightIcon className="w-4 h-4 ml-1" />
            </motion.a> */}
          </motion.div>

          {/* Case 3 - Contrôle */}
          <motion.div 
            variants={item}
            className={`${cardBgClass} p-8 rounded-lg shadow-sm border-l-4 ${darkMode ? 'border-red-500' : 'border-red-600'} hover:shadow-md transition-all h-full flex flex-col`}
            whileHover={{ y: -5 }}
          >
            <motion.div 
              className={`${darkMode ? 'bg-red-900' : 'bg-red-100'} w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${darkMode ? 'text-red-300' : 'text-red-600'}`}
              animate={{
                rotate: [0, 360],
                transition: { 
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            >
              <motion.svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{
                  rotate: [0, -360],
                  transition: { 
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </motion.svg>
            </motion.div>
            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Contrôle des Procédures</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} flex-grow`}>
              Vérification systématique du respect des normes et réglementations en vigueur
            </p>
            {/* <motion.a 
              href="/controle" 
              className={`mt-4 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} font-medium inline-flex items-center`}
              whileHover={{ x: 3 }}
            >
              En savoir plus <ChevronRightIcon className="w-4 h-4 ml-1" />
            </motion.a> */}
          </motion.div>

          {/* Case 4 - Formation */}
          <motion.div 
            variants={item}
            className={`${cardBgClass} p-8 rounded-lg shadow-sm border-l-4 ${darkMode ? 'border-purple-500' : 'border-purple-600'} hover:shadow-md transition-all h-full flex flex-col`}
            whileHover={{ y: -5 }}
          >
            <motion.div 
              className={`${darkMode ? 'bg-purple-900' : 'bg-purple-100'} w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}
              animate={{
                scale: [1, 1.05, 1],
                transition: { 
                  duration: 3,
                  repeat: Infinity
                }
              }}
            >
              <motion.svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{
                  y: [0, -2, 0],
                  transition: { 
                    duration: 3,
                    repeat: Infinity
                  }
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </motion.svg>
            </motion.div>
            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Formation des Acteurs</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} flex-grow`}>
              Programme national de formation pour les acheteurs publics et soumissionnaires
            </p>
            {/* <motion.a 
              href="/formation" 
              className={`mt-4 ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'} font-medium inline-flex items-center`}
              whileHover={{ x: 3 }}
            >
              En savoir plus <ChevronRightIcon className="w-4 h-4 ml-1" />
            </motion.a> */}
          </motion.div>
        </div>
      </motion.section>

      {/* Section À propos */}
      <motion.section 
        initial="hidden"
        animate="show"
        variants={container}
        className={`py-12 px-6 md:px-20 ${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-50 backdrop-blur-sm my-8 rounded-xl max-w-6xl mx-auto`}
      >
        <motion.h2 
          variants={item}
          className={`text-3xl font-bold text-center mb-8 ${darkMode ? 'text-white' : 'text-blue-800'}`}
        >
          À Propos de Notre Plateforme
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            variants={item}
            className={`${cardBgClass} p-6 rounded-lg shadow-md ${borderClass}`}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut"
                }
              }}
              className="flex justify-center mb-4"
            >
              <FaHandshake className={`text-4xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </motion.div>
            <h3 className={`text-xl font-semibold text-center mb-3 ${darkMode ? 'text-white' : 'text-blue-700'}`}>Transparence</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-center`}>
              Nous garantissons une gestion transparente et équitable de tous les marchés publics.
            </p>
          </motion.div>
          
          <motion.div 
            variants={item}
            className={`${cardBgClass} p-6 rounded-lg shadow-md ${borderClass}`}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: 0.5
                }
              }}
              className="flex justify-center mb-4"
            >
              <FaChartLine className={`text-4xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </motion.div>
            <h3 className={`text-xl font-semibold text-center mb-3 ${darkMode ? 'text-white' : 'text-blue-700'}`}>Efficacité</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-center`}>
              Optimisation des processus pour une gestion plus rapide et plus efficace des appels d'offres.
            </p>
          </motion.div>
          
          <motion.div 
            variants={item}
            className={`${cardBgClass} p-6 rounded-lg shadow-md ${borderClass}`}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: 1
                }
              }}
              className="flex justify-center mb-4"
            >
              <FaGlobe className={`text-4xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </motion.div>
            <h3 className={`text-xl font-semibold text-center mb-3 ${darkMode ? 'text-white' : 'text-blue-700'}`}>Accessibilité</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-center`}>
              Plateforme accessible à toutes les entreprises, favorisant une concurrence saine et ouverte.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          variants={item}
          className="mt-10 text-center max-w-3xl mx-auto"
        >
          <p className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} mb-6`}>
            Notre plateforme a été créée pour moderniser la gestion des marchés publics, en mettant à disposition des outils numériques performants qui simplifient les processus tout en garantissant l'intégrité et la transparence des transactions.
          </p>
        </motion.div>
      </motion.section>

      {/* Section des Procédures en Cours */}
      <section className={`py-12 px-6 md:px-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="show"
            variants={slideUp}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-blue-800'}`}>
              Procédures Contractuelles en Cours
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Liste des marchés publics actuellement en phase de consultation
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : filteredOffers.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeIn}
              className={`text-center py-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}
            >
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {searchTerm 
                  ? "Aucune procédure ne correspond à vos critères" 
                  : "Aucune consultation en cours actuellement"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  variants={item}
                  whileHover={{ y: -5 }}
                >
                  <div 
                    className={`${cardBgClass} border ${borderClass} rounded-lg shadow-sm hover:shadow-md transition-all h-full flex flex-col overflow-hidden`}
                    onClick={() => navigate(`/marches/${offer.id}`)}
                  >
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {offer.title}
                        </h3>
                        {offer.statut === 'urgent' && (
                          <span className={`${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'} text-xs px-2 py-1 rounded-full`}>
                            Prioritaire
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-700'} px-3 py-1 rounded-full text-xs font-medium`}>
                          {offer.category || 'Tous secteurs'}
                        </span>
                        <span className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} px-3 py-1 rounded-full text-xs font-medium`}>
                          Réf: {offer.reference}
                        </span>
                      </div>

                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 line-clamp-3`}>
                        {offer.description}
                      </p>
                    </div>

                    <div className={`px-6 py-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-t ${borderClass}`}>
                      <div className="flex justify-between items-center">
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className="font-medium">Clôture:</span> {new Date(offer.deadline).toLocaleDateString()}
                        </div>
                        <button className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} text-sm font-medium flex items-center`}>
                          Détails <ChevronRightIcon className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Section Services Ministériels */}
      <section className={`py-16 px-6 md:px-20 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${borderClass}`}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="max-w-7xl mx-auto"
        >
          <motion.h2 
            variants={item}
            className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-blue-800'}`}
          >
            Nos Services en Ligne
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <motion.div
              variants={item}
              whileHover={{ y: -5 }}
              className={`${cardBgClass} p-8 rounded-xl shadow-sm border ${borderClass} hover:shadow-md transition-all text-center`}
            >
              <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6`}>
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    transition: { duration: 3, repeat: Infinity }
                  }}
                >
                  <FaFileAlt className={`text-3xl ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                </motion.div>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dépôt Electronique</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Soumettez vos offres en ligne de manière sécurisée et simplifiée
              </p>
              {/* <Link 
                to="/depot" 
                className={`inline-flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}
              >
                Accéder au service <ChevronRightIcon className="w-4 h-4 ml-2" />
              </Link> */}
            </motion.div>

            {/* Service 2 */}
            <motion.div
              variants={item}
              whileHover={{ y: -5 }}
              className={`${cardBgClass} p-8 rounded-xl shadow-sm border ${borderClass} hover:shadow-md transition-all text-center`}
            >
              <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6`}>
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 4, repeat: Infinity }
                  }}
                >
                  <FaChartLine className={`text-3xl ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                </motion.div>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Suivi des Marchés</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Visualisez l'avancement des procédures en temps réel
              </p>
              {/* <Link 
                to="/suivi" 
                className={`inline-flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}
              >
                Accéder au service <ChevronRightIcon className="w-4 h-4 ml-2" />
              </Link> */}
            </motion.div>

            {/* Service 3 */}
            <motion.div
              variants={item}
              whileHover={{ y: -5 }}
              className={`${cardBgClass} p-8 rounded-xl shadow-sm border ${borderClass} hover:shadow-md transition-all text-center`}
            >
              <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6`}>
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    transition: { duration: 3, repeat: Infinity }
                  }}
                >
                  <FaUsers className={`text-3xl ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                </motion.div>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Espace Professionnel</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Gestion centralisée de vos dossiers et documents
              </p>
              {/* <Link 
                to="/espace-pro" 
                className={`inline-flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}
              >
                Accéder au service <ChevronRightIcon className="w-4 h-4 ml-2" />
              </Link> */}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial="hidden"
        animate="show"
        variants={fadeIn}
        className={`${darkMode ? 'bg-gray-800' : 'bg-blue-800'} text-white py-10 mt-auto`}
      >
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold mb-4">Plateforme des Marchés Publics</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-200'} mb-4`}>
            Un outil moderne pour une gestion transparente des marchés publics
          </p>
          <div className="flex justify-center gap-6 text-xl mb-6">
            <motion.a 
              whileHover={{ scale: 1.2, color: "#ffffff" }}
              href="#" 
              aria-label="Facebook" 
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-blue-300 hover:text-white'}`}
            >
              <i className="fab fa-facebook-f"></i>
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.2, color: "#ffffff" }}
              href="#" 
              aria-label="Twitter" 
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-blue-300 hover:text-white'}`}
            >
              <i className="fab fa-twitter"></i>
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.2, color: "#ffffff" }}
              href="#" 
              aria-label="LinkedIn" 
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-blue-300 hover:text-white'}`}
            >
              <i className="fab fa-linkedin-in"></i>
            </motion.a>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-blue-300'}`}>© {new Date().getFullYear()} Ministère des Finances – Tous droits réservés</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;