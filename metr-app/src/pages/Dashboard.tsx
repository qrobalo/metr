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

  // Mapper les statuts de la BDD aux affichages
  const getStatusDisplay = (statut: string) => {
    const statusMap: any = {
      'En_cours': { label: 'En cours', color: 'bg-green-100 text-green-700' },
      'Termine': { label: 'Terminé', color: 'bg-blue-100 text-blue-700' },
      'En_attente': { label: 'Brouillon', color: 'bg-yellow-100 text-yellow-700' },
      'Archive': { label: 'Archivé', color: 'bg-gray-100 text-gray-700' }
    };
    return statusMap[statut] || statusMap['En_attente'];
  };

  // Calculer les statistiques réelles
  const stats = {
    projetsActifs: projects.filter(p => p.statut === 'En_cours').length,
    projetsTotal: projects.length,
    projetsTermines: projects.filter(p => p.statut === 'Termine').length
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#1e3a8a]">Mes projets récents</h2>
        <button 
          onClick={onCreateProject} 
          className="bg-[#f97316] text-white px-6 py-3 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Créer un nouveau projet
        </button>
      </div>

      {/* Projects Grid */}
      {recentProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {recentProjects.map((project) => {
            const status = getStatusDisplay(project.statut);
            return (
              <div 
                key={project.idProjet} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                      {project.nom}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {project.client || 'Rénovation Paris'}
                    </p>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Créé le {formatDate(project.dateCreation)}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onOpenProject(project.idProjet)}
                    className="flex-1 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ouvrir
                  </button>
                  <button className="flex-1 border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Dossier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center mb-12">
          <p className="text-gray-500 mb-4 text-lg">Vous n'avez pas encore de projet</p>
          <button 
            onClick={onCreateProject} 
            className="bg-[#f97316] text-white px-6 py-3 rounded-lg hover:bg-[#ea580c] transition-colors font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Créer votre premier projet
          </button>
        </div>
      )}

      {/* Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6">Mes statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Projets actifs</p>
            <div className="flex items-end justify-between">
              <p className="text-5xl font-bold text-[#1e3a8a]">{stats.projetsActifs}</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-600">+1 ce mois-ci</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">m² mesurés ce mois</p>
            <div className="flex items-end justify-between">
              <p className="text-5xl font-bold text-[#1e3a8a]">1 254</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-600">+326 vs mois dernier</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Exports récents</p>
            <div className="flex items-end justify-between">
              <p className="text-5xl font-bold text-[#1e3a8a]">8</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <p className="text-sm text-gray-600">Dernier: 2 jours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}