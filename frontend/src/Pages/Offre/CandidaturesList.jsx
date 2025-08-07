import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

const CandidaturesList = ({ role }) => {
  const { darkMode } = useTheme();
  const [candidatures, setCandidatures] = useState([]);
  const [offersMap, setOffersMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`http://localhost:3000/api/dashboard/${role}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCandidatures(data.candidatures || []);
        const offersArray = data.offers || [];
        const offerMapTemp = {};
        offersArray.forEach(o => offerMapTemp[o.id] = o.title);
        setOffersMap(offerMapTemp);
      } catch (err) {
        console.error('Erreur lors du chargement des candidatures', err);
      }
    };

    fetchData();
  }, [role]);

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`rounded-lg shadow-lg p-6 transition-colors ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className={`text-xl font-bold mb-4 transition-colors ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Toutes les candidatures reçues
        </h2>
        {candidatures.length === 0 ? (
          <p className={`transition-colors ${
            darkMode ? 'text-blue-400' : 'text-blue-700'
          }`}>
            Aucune candidature reçue.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className={`w-full table-auto border-collapse transition-colors ${
              darkMode ? 'border-gray-600' : 'border-blue-200'
            }`}>
              <thead>
                <tr className={`transition-colors ${
                  darkMode ? 'bg-gray-700' : 'bg-blue-100'
                }`}>
                  <th className={`border px-4 py-2 transition-colors ${
                    darkMode
                      ? 'border-gray-600 text-gray-200'
                      : 'border-blue-200 text-gray-800'
                  }`}>
                    Entreprise
                  </th>
                  <th className={`border px-4 py-2 transition-colors ${
                    darkMode
                      ? 'border-gray-600 text-gray-200'
                      : 'border-blue-200 text-gray-800'
                  }`}>
                    Offre
                  </th>
                  <th className={`border px-4 py-2 transition-colors ${
                    darkMode
                      ? 'border-gray-600 text-gray-200'
                      : 'border-blue-200 text-gray-800'
                  }`}>
                    Date
                  </th>
                  <th className={`border px-4 py-2 transition-colors ${
                    darkMode
                      ? 'border-gray-600 text-gray-200'
                      : 'border-blue-200 text-gray-800'
                  }`}>
                    Fichier
                  </th>
                  <th className={`border px-4 py-2 transition-colors ${
                    darkMode
                      ? 'border-gray-600 text-gray-200'
                      : 'border-blue-200 text-gray-800'
                  }`}>
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {candidatures.map(c => (
                  <tr key={c.id} className={`text-sm transition-colors ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'
                  }`}>
                    <td className={`border px-4 py-2 transition-colors ${
                      darkMode
                        ? 'border-gray-600 text-gray-300'
                        : 'border-blue-200 text-gray-900'
                    }`}>
                      {c.entreprise}
                    </td>
                    <td className={`border px-4 py-2 transition-colors ${
                      darkMode
                        ? 'border-gray-600 text-gray-300'
                        : 'border-blue-200 text-gray-900'
                    }`}>
                      {offersMap[c.offerId] || "Inconnu"}
                    </td>
                    <td className={`border px-4 py-2 transition-colors ${
                      darkMode
                        ? 'border-gray-600 text-gray-300'
                        : 'border-blue-200 text-gray-900'
                    }`}>
                      {new Date(c.submittedAt).toLocaleDateString()}
                    </td>
                    <td className={`border px-4 py-2 transition-colors ${
                      darkMode ? 'border-gray-600' : 'border-blue-200'
                    }`}>
                      {c.fileUrl ? (
                        <a
                          href={`http://localhost:3000${c.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`underline transition-colors ${
                            darkMode
                              ? 'text-blue-400 hover:text-blue-300'
                              : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          Voir le fichier
                        </a>
                      ) : (
                        <span className={`transition-colors ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Aucun
                        </span>
                      )}
                    </td>
                    <td className={`border px-4 py-2 transition-colors ${
                      darkMode
                        ? 'border-gray-600 text-gray-300'
                        : 'border-blue-200 text-gray-900'
                    }`}>
                      {c.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidaturesList;
