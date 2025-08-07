import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome, FaUsers, FaFileAlt, FaSignOutAlt, FaChartPie, FaPlus, FaSun, FaMoon
} from 'react-icons/fa';
import { Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

Chart.register(...registerables);

const DashboardAdmin = () => {
  const { darkMode, setDarkMode } = useTheme();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOffer, setNewOffer] = useState({ title: '', description: '', deadline: '' });
  const [createError, setCreateError] = useState('');

  const navigate = useNavigate();

  const fetchDashboard = () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    setLoading(true);
    fetch('http://localhost:3000/api/dashboard/admin', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des données');
        return res.json();
      })
      .then(data => {
        setDashboard(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDeleteUser = (username) => {
    if (!window.confirm(`Supprimer ${username} ?`)) return;
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/users/${username}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Utilisateur supprimé");
        fetchDashboard();
      });
  };

  const handleCreateOffer = () => {
  setCreateError('');
  if (!newOffer.title || !newOffer.description || !newOffer.deadline) {
    setCreateError("Tous les champs sont obligatoires");
    return;
  }

  const token = localStorage.getItem('token');
  fetch('http://localhost:3000/api/admin/offres', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...newOffer,
      status: 'en_attente' 
    })
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la création de l\'offre');
      alert(data.message || "Offre créée");
      setShowCreateForm(false);
      setNewOffer({ title: '', description: '', deadline: '' });
      fetchDashboard();
    })
    .catch(err => setCreateError(err.message));
};


  const handleDeleteOffer = (offerId) => {
    if (!window.confirm("Supprimer cette offre ?")) return;
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/admin/offres/${offerId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Offre supprimée");
        fetchDashboard();
      });
  };

  if (loading) return (
    <div className={`flex items-center justify-center h-screen transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
    </div>
  );
  if (error) return (
    <div className={`text-center mt-10 transition-colors ${
      darkMode ? 'bg-gray-900 text-red-400' : 'bg-gray-100 text-red-600'
    }`}>
      {error}
    </div>
  );
  if (!dashboard) return null;

  const monthsLabels = Object.keys(dashboard.statsByMonth || {}).sort();
  const offersCountByMonth = monthsLabels.map(m => dashboard.statsByMonth[m]);

  const lineChartData = {
    labels: monthsLabels,
    datasets: [{
      label: 'Offres créées',
      data: offersCountByMonth,
      borderColor: '#6366F1',
      backgroundColor: '#E0E7FF',
      borderWidth: 2,
      fill: true
    }]
  };

  const pieChartData = {
    labels: ['Entreprises', 'Ministères', 'Admins'],
    datasets: [{
      data: [dashboard.stats.entreprises, dashboard.stats.ministeres, 1],
      backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6']
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: darkMode ? '#f3f4f6' : '#374151'
        }
      }
    },
    animation: { duration: 0 },
    scales: {
      x: {
        ticks: { color: darkMode ? '#f3f4f6' : '#374151' },
        grid: { color: darkMode ? '#374151' : '#e5e7eb' }
      },
      y: {
        ticks: { color: darkMode ? '#f3f4f6' : '#374151' },
        grid: { color: darkMode ? '#374151' : '#e5e7eb' }
      }
    }
  };

  return (
    <div className={`flex min-h-screen transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className={`w-64 py-8 px-4 fixed h-full transition-colors ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-gray-800 text-white'
      }`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-gray-300" />}
          </button>
        </div>
        <nav className="space-y-2">
          <SidebarButton icon={<FaHome />} label="Accueil" onClick={() => navigate('/')} />
          <SidebarButton icon={<FaChartPie />} label="Statistiques" onClick={() => window.scrollTo(0, 0)} />
          <SidebarButton icon={<FaUsers />} label="Utilisateurs" onClick={() => document.getElementById('users-section')?.scrollIntoView()} />
          <SidebarButton icon={<FaFileAlt />} label="Offres" onClick={() => document.getElementById('offers-section')?.scrollIntoView()} />
          <SidebarButton icon={<FaPlus />} label="Créer Offre" onClick={() => setShowCreateForm(!showCreateForm)} />
          <div className="pt-4 mt-4 border-t border-gray-700">
            <SidebarButton icon={<FaSignOutAlt />} label="Déconnexion" onClick={handleLogout} isLogout />
          </div>
        </nav>
      </div>

      <div className="flex-1 ml-64 p-6">
        <h1 className={`text-3xl font-bold mb-6 transition-colors ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Tableau de Bord Administrateur
        </h1>

        {showCreateForm && (
          <div className={`p-6 rounded shadow mb-6 transition-colors ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-bold mb-4 transition-colors ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Créer une Nouvelle Offre
            </h2>
            <input
              type="text"
              placeholder="Titre"
              value={newOffer.title}
              onChange={e => setNewOffer({ ...newOffer, title: e.target.value })}
              className={`border p-2 w-full mb-2 rounded transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <textarea
              placeholder="Description"
              value={newOffer.description}
              onChange={e => setNewOffer({ ...newOffer, description: e.target.value })}
              className={`border p-2 w-full mb-2 rounded transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <input
              type="date"
              value={newOffer.deadline}
              onChange={e => setNewOffer({ ...newOffer, deadline: e.target.value })}
              className={`border p-2 w-full mb-2 rounded transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            {createError && (
              <p className={`mb-2 transition-colors ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                {createError}
              </p>
            )}
            <button
              onClick={handleCreateOffer}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              Publier l'offre
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard label="Appels d'Offres" value={dashboard.stats.offers} icon={<FaFileAlt />} color="indigo" />
          <StatCard label="Candidatures" value={dashboard.stats.candidatures} icon={<FaUsers />} color="green" />
          <StatCard label="Utilisateurs" value={dashboard.stats.users} icon={<FaUsers />} color="yellow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded shadow transition-colors ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-bold mb-4 transition-colors ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Statistiques par mois
            </h2>
            <div className="h-80"><Line data={lineChartData} options={chartOptions} /></div>
          </div>
          <div className={`p-6 rounded shadow transition-colors ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-bold mb-4 transition-colors ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Répartition par rôle
            </h2>
            <div className="h-80"><Pie data={pieChartData} options={chartOptions} /></div>
          </div>
        </div>

        <section id="users-section" className={`rounded shadow mb-8 transition-colors ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`p-6 border-b transition-colors ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold transition-colors ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Utilisateurs
            </h2>
          </div>
          <div className="overflow-x-auto">
            {dashboard.users.length === 0 ? (
              <p className={`p-6 transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Aucun utilisateur trouvé.
              </p>
            ) : (
              <table className={`min-w-full divide-y transition-colors ${
                darkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                <thead className={`transition-colors ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <tr>
                    <th className={`px-6 py-3 transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-800'
                    }`}>Nom</th>
                    <th className={`px-6 py-3 transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-800'
                    }`}>Email</th>
                    <th className={`px-6 py-3 transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-800'
                    }`}>Rôle</th>
                    <th className={`px-6 py-3 transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-800'
                    }`}>Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y transition-colors ${
                  darkMode ? 'divide-gray-700' : 'divide-gray-200'
                }`}>
                  {dashboard.users.map((user, index) => (
                    <tr key={index} className={`transition-colors ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}>
                      <td className={`px-6 py-4 transition-colors ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>{user.username}</td>
                      <td className={`px-6 py-4 transition-colors ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>{user.email}</td>
                      <td className={`px-6 py-4 capitalize transition-colors ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>{user.role}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteUser(user.username)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section id="offers-section" className={`rounded shadow mb-8 transition-colors ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`p-6 border-b transition-colors ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold transition-colors ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Gestion des Offres
            </h2>
          </div>
          <div>
            {dashboard.offers.length === 0 ? (
              <p className={`p-6 transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Aucune offre disponible.
              </p>
            ) : (
              dashboard.offers.map((offer, index) => (
                <div key={index} className={`p-6 border-b transition-all ${
                  darkMode
                    ? 'border-gray-700 hover:bg-gray-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <h3 className={`text-lg font-semibold transition-colors ${
                    darkMode ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>
                    {offer.title}
                  </h3>
                  <p className={`text-sm transition-colors ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Par {offer.createdBy} • {new Date(offer.createdAt).toLocaleDateString()}
                  </p>
                  <p className={`mt-2 transition-colors ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {offer.description.substring(0, 100)}...
                  </p>
                  <div className="mt-3 flex gap-3">
                    <button
                      className="bg-yellow-400 text-white px-3 py-1 rounded cursor-not-allowed opacity-50"
                      title="Fonction modification à implémenter"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={`rounded shadow transition-colors ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`p-6 border-b transition-colors ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold transition-colors ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Candidatures reçues
            </h2>
          </div>
          <div className="overflow-x-auto">
            {dashboard.candidatures.length === 0 ? (
              <p className={`p-6 transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Aucune candidature reçue.
              </p>
            ) : (
              <table className={`min-w-full divide-y transition-colors ${
                darkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                <thead className={`transition-colors ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <tr>
                    <th className={`px-6 py-3 transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-800'
                    }`}>Entreprise</th>
                    <th className={`px-6 py-3 transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-800'
                    }`}>Offre</th>
                    <th className={`px-6 py-3 transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-800'
                    }`}>Fichier</th>
                  </tr>
                </thead>
                <tbody className={`divide-y transition-colors ${
                  darkMode ? 'divide-gray-700' : 'divide-gray-200'
                }`}>
                  {dashboard.candidatures.map((c, index) => (
                    <tr key={index} className={`transition-colors ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}>
                      <td className={`px-6 py-4 transition-colors ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>{c.entreprise}</td>
                      <td className={`px-6 py-4 transition-colors ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>{c.offerId}</td>
                      <td className="px-6 py-4">
                        {c.fileUrl ? (
                          <a
                            href={`http://localhost:3000${c.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`underline transition-colors ${
                              darkMode
                                ? 'text-blue-400 hover:text-blue-300'
                                : 'text-blue-600 hover:text-blue-800'
                            }`}
                          >
                            Télécharger
                          </a>
                        ) : (
                          <span className={`transition-colors ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Aucun fichier
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const SidebarButton = ({ icon, label, onClick, isLogout = false }) => (
  <button onClick={onClick} className={`flex items-center w-full px-4 py-3 rounded-md ${isLogout ? 'text-red-400 hover:bg-red-900/10' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };
  return (
    <div className={`${colors[color]} p-6 rounded-lg shadow flex justify-between items-center`}>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  );
};

export default DashboardAdmin;
