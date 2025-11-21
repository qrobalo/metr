import React from 'react';
import { Plus, ExternalLink, MoreVertical, TrendingUp } from 'lucide-react';

interface DashboardProps {
  projects: any[];
  onCreateProject: () => void;
  onOpenProject: (id: number) => void;
}

export default function Dashboard({ projects, onCreateProject, onOpenProject }: DashboardProps) {
  // Prendre seulement les 6 projets les plus récents
  const recentProjects = projects.slice(0, 6);

  // Mapper les statuts de la base de données aux couleurs
  const getStatusColor = (statut: string) => {
    const statusMap: any = {
      'En_cours': { label: 'En cours', color: 'bg-green-100 text-green-700' },
      'Termine': { label: 'Terminé', color: 'bg-blue-100 text-blue-700' },
      'En_attente': { label: 'Brouillon', color: 'bg-yellow-100 text-yellow-700' },
      'Archive': { label: 'Archivé', color: 'bg-gray-100 text-gray-700' }
    };
    return statusMap[statut] || statusMap['En_attente'];
  };

  // Calculer les statistiques
  const stats = {
    projetsActifs: projects.filter(p => p.statut === 'En_cours').length,
    projetsTotal: projects.length
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

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
      {recentProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {recentProjects.map((project) => {
            const status = getStatusColor(project.statut);
            return (
              <div key={project.idProjet} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {project.nom}
                    </h3>
                    <p className="text-sm text-gray-500">{project.client || 'Sans client'}</p>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Créé le {formatDate(project.dateCreation)}
                  </p>
                  <span className={`status-badge ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onOpenProject(project.idProjet)}
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
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12 mb-12">
          <p className="text-gray-500 mb-4">Aucun projet pour le moment</p>
          <button onClick={onCreateProject} className="btn-secondary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Créer votre premier projet
          </button>
        </div>
      )}

      {/* Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-primary-900 mb-6">Mes statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Projets actifs</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-primary-900">{stats.projetsActifs}</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-600">En cours</p>
            </div>
          </div>

          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Total de projets</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-primary-900">{stats.projetsTotal}</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <p className="text-sm text-gray-600">Tous statuts confondus</p>
            </div>
          </div>

          <div className="card">
            <p className="text-sm text-gray-600 mb-2">m² mesurés ce mois</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-primary-900">0</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <p className="text-sm text-gray-600">Bientôt disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}