import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHome, FaUsers, FaBriefcase, FaFileAlt, FaArrowUp, FaUserFriends,
  FaChartLine, FaSun, FaMoon, FaBars, FaEye
} from "react-icons/fa";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Sidebar = ({ darkMode, toggleDarkMode, activeMenu, setActiveMenu, sidebarOpen, setSidebarOpen }) => (
  <div className={`
    fixed lg:static z-50 top-0 left-0 h-full transition-transform duration-300
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
    w-64 shadow-2xl
    ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 border-r border-gray-200'}
  `}>
    <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <FaHome className="text-white text-lg" />
          </div>
          <h1 className="text-xl font-bold">Fusion</h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {darkMode ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
        </button>
      </div>
    </div>

    <div className="p-4">
      <div className="mb-6">
        <h3 className={`text-xs uppercase tracking-wide mb-3 px-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>MAIN NAVIGATION</h3>
        <nav className="space-y-1">
          {[
            { name: 'Accueil', icon: <FaHome />, key: 'dashboard' },
            { name: 'Users', icon: <FaUsers />, key: 'users' },
            { name: 'Job Offers', icon: <FaBriefcase />, key: 'offers' },
            { name: 'Applications', icon: <FaFileAlt />, key: 'applications' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeMenu === item.key
                  ? (darkMode ? 'bg-gray-800 text-white' : 'bg-purple-100 text-purple-800')
                  : (darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, icon, gradient, percentage, trend }) => (
  <div className={`relative p-6 rounded-2xl text-white ${gradient} overflow-hidden`}>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium opacity-90">{title}</div>
        <div className="text-2xl opacity-80">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="flex items-center space-x-2 text-sm opacity-90">
        <span className={`flex items-center ${trend > 0 ? 'text-green-200' : 'text-red-200'}`}>
          <FaArrowUp className={`mr-1 ${trend > 0 ? '' : 'transform rotate-180'}`} />
          {Math.abs(percentage)}%
        </span>
        <span>vs last month</span>
      </div>
    </div>
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
  </div>
);

const DashboardMinistere = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.REACT_APP_API_URL || "https://marcherpub.onrender.com/api";
      const response = await axios.get(`${apiUrl}/dashboard/ministere`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (loading) return <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}><div className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Chargement...</div></div>;
  if (error) return <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}><div className="text-xl font-semibold text-red-600">Erreur: {error}</div></div>;
  if (!dashboardData) return null;

  const { users, offers, candidatures, stats, chartData } = dashboardData;
  const { users: userStats, offers: offerStats, candidatures: candidatureStats } = stats;

  const lineChartData = {
    labels: chartData?.map(item => item.month) || [],
    datasets: [
      { label: 'Utilisateurs', data: chartData?.map(item => item.users) || [], borderColor: 'rgb(168, 85, 247)', backgroundColor: 'rgba(168, 85, 247, 0.1)', tension: 0.4, fill: true },
      { label: 'Offres', data: chartData?.map(item => item.offers) || [], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.1)', tension: 0.4, fill: true }
    ]
  };

  const doughnutData = {
    labels: ['Utilisateurs', 'Offres Validées', 'Candidatures Acceptées'],
    datasets: [{
      data: [userStats?.total || 0, offerStats?.valides || 0, candidatureStats?.acceptees || 0],
      backgroundColor: ['rgb(168, 85, 247)','rgb(59, 130, 246)','rgb(16, 185, 129)'],
      borderWidth: 0,
    }]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } };
  const doughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }, cutout: '70%' };

  const renderSection = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <>
            <div className="mb-8">
              <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard Ministère</h1>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Bienvenue dans votre tableau de bord administrateur</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Utilisateurs" value={userStats?.total || 0} icon={<FaUsers />} gradient="bg-gradient-to-br from-purple-500 to-purple-700" percentage={12} trend={1}/>
              <StatCard title="Total Offres" value={offerStats?.total || 0} icon={<FaBriefcase />} gradient="bg-gradient-to-br from-blue-500 to-blue-700" percentage={8} trend={1}/>
              <StatCard title="Total Candidatures" value={candidatureStats?.total || 0} icon={<FaFileAlt />} gradient="bg-gradient-to-br from-cyan-500 to-cyan-700" percentage={15} trend={1}/>
              <StatCard title="Offres Validées" value={offerStats?.valides || 0} icon={<FaChartLine />} gradient="bg-gradient-to-br from-orange-500 to-orange-700" percentage={23} trend={1}/>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 mb-8">
              <div className={`lg:col-span-5 rounded-2xl p-6 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`} style={{minHeight:'300px'}}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Analytics</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Évolution mensuelle</p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{userStats?.total + offerStats?.total || 0}</div>
                </div>
                <div className="h-64"><Line data={lineChartData} options={chartOptions} /></div>
              </div>

              <div className={`lg:col-span-3 rounded-2xl p-6 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`} style={{minHeight:'300px'}}>
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Répartition</h3>
                  <div className="text-3xl font-bold text-purple-600 mt-2">{candidatureStats?.total || 0}</div>
                </div>
                <div className="h-48"><Doughnut data={doughnutData} options={doughnutOptions} /></div>
              </div>
            </div>

            {/* Recent Users & Offers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users */}
              <div className={`rounded-2xl p-6 shadow-sm overflow-x-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Utilisateurs Récents</h3>
                  <button className="text-sm text-purple-600 hover:text-purple-700">Voir tout</button>
                </div>
                <div className="space-y-4 min-w-[300px]">
                  {users && users.length > 0 ? users.slice(0,5).map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <FaUserFriends className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.nom || user.username}</p>
                          <p className="text-xs text-gray-400">Utilisateur - {user.role}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</div>
                    </div>
                  )) : <p>Aucun utilisateur récent</p>}
                </div>
              </div>

              {/* Offers */}
              <div className={`rounded-2xl p-6 shadow-sm overflow-x-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Offres Récentes</h3>
                  <button className="text-sm text-purple-600 hover:text-purple-700">Gérer</button>
                </div>
                <div className="space-y-4 min-w-[300px]">
                  {offers && offers.length > 0 ? offers.slice(0,5).map(offer => (
                    <div key={offer.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FaBriefcase className="text-gray-600 text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{offer.title}</p>
                          <p className="text-xs text-gray-400">{offer.company?.companyName || offer.company?.nom || 'Entreprise'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          offer.status === 'valide' ? 'bg-green-100 text-green-800' :
                          offer.status === 'en_attente' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>{offer.status}</span>
                        <FaEye className="text-gray-400 text-sm" />
                      </div>
                    </div>
                  )) : <p>Aucune offre récente</p>}
                </div>
              </div>
            </div>
          </>
        );
      case 'users':
        return (
          <div className="overflow-x-auto">
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Liste des utilisateurs</h2>
            <div className="min-w-[400px] space-y-4">
              {users && users.length > 0 ? users.map(user => (
                <div key={user.id} className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{user.nom || user.username}</span>
                    <span className="text-xs">{user.role}</span>
                  </div>
                  <div className="text-xs">{user.email}</div>
                </div>
              )) : <p>Aucun utilisateur trouvé</p>}
            </div>
          </div>
        );
      case 'offers':
        return (
          <div className="overflow-x-auto">
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Liste des offres</h2>
            <div className="min-w-[400px] space-y-4">
              {offers && offers.length > 0 ? offers.map(offer => (
                <div key={offer.id} className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                  <div className="font-medium">{offer.title}</div>
                  <div className="text-xs">{offer.status}</div>
                  <div className="text-xs">{offer.company?.companyName || offer.company?.nom || 'Entreprise'}</div>
                </div>
              )) : <p>Aucune offre trouvée</p>}
            </div>
          </div>
        );
      case 'applications':
        return (
          <div className="overflow-x-auto">
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Liste des candidatures</h2>
            <div className="min-w-[400px] space-y-4">
              {candidatures && candidatures.length > 0 ? candidatures.map(c => (
                <div key={c.id} className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                  <div className="flex justify-between">
                    <span className="font-medium">{c.user?.nom || c.user?.username}</span>
                    <span className="text-xs">{c.status}</span>
                  </div>
                  <div className="text-xs">{c.offer?.title}</div>
                </div>
              )) : <p>Aucune candidature trouvée</p>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Hamburger */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded bg-purple-600 text-white">
        <FaBars />
      </button>

      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} activeMenu={activeMenu} setActiveMenu={setActiveMenu} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 p-4 lg:p-8 lg:ml-64">{renderSection()}</div>
    </div>
  );
};

export default DashboardMinistere;
