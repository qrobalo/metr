import React from 'react';
import { Plus, ExternalLink, MoreVertical, TrendingUp } from 'lucide-react';

interface DashboardProps {
  onCreateProject: () => void;
  onOpenProject: (id: number) => void;
}

export default function Dashboard({ onCreateProject, onOpenProject }: DashboardProps) {
  const recentProjects = [
    {
      id: 1,
      name: 'Résidence Les Terrasses',
      type: 'Rénovation Paris',
      date: '15/10/2025',
      status: 'En cours',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      id: 2,
      name: 'Bureau OpenSpace',
      type: 'Rénovation Paris',
      date: '15/10/2025',
      status: 'Terminé',
      statusColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 3,
      name: 'Maison écologique',
      type: 'Rénovation Paris',
      date: '15/10/2025',
      status: 'Terminé',
      statusColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 4,
      name: 'Rénovation Villa Marine',
      type: 'Rénovation Paris',
      date: '15/10/2025',
      status: 'Brouillon',
      statusColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 5,
      name: 'Immeuble résidentiel',
      type: 'Rénovation Paris',
      date: '15/10/2025',
      status: 'En cours',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      id: 6,
      name: 'Immeuble Haussmannien',
      type: 'Rénovation Paris',
      date: '15/10/2025',
      status: 'Brouillon',
      statusColor: 'bg-yellow-100 text-yellow-700'
    }
  ];

  const stats = [
    { label: 'Projets actifs', value: '4', change: '+1 ce mois-ci', trend: 'up' },
    { label: 'm² mesurés ce mois', value: '1 254', change: '+326 vs mois dernier', trend: 'up' },
    { label: 'Exports récents', value: '8', change: 'Dernier: 2 jours', trend: 'neutral' }
  ];

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-primary-900">Mes projets récents</h2>
        <button onClick={onCreateProject} className="btn-secondary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Créer un nouveau projet
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {recentProjects.map((project) => (
          <div key={project.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500">{project.type}</p>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Créé le {project.date}</p>
              <span className={`status-badge ${project.statusColor}`}>
                {project.status}
              </span>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => onOpenProject(project.id)}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Ouvrir
              </button>
              <button className="btn-outline flex-1">
                Dossier
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-primary-900 mb-6">Mes statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="card">
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-bold text-primary-900">{stat.value}</p>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {stat.trend === 'up' && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}