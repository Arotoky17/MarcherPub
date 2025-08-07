// DashboardChart.jsx
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#3b82f6']; // Vert, Rouge, Bleu

export default function DashboardChart({ stats }) {
  const data = [
    { name: 'Validées', value: stats.actifs },
    { name: 'Rejetées', value: stats.rejetees },
    { name: 'Autres', value: stats.total - stats.actifs - stats.rejetees },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-10">
      <h2 className="text-xl font-semibold mb-4">Répartition des Offres</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
