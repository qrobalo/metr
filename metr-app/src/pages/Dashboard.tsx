import React from 'react';
import { Plus, ExternalLink, TrendingUp, FolderOpen, Calendar, Users } from 'lucide-react';

interface DashboardProps {
  projects: any[];
  onCreateProject: () => void;
  onOpenProject: (id: number) => void;
}

export default function Dashboard({ projects, onCreateProject, onOpenProject }: DashboardProps) {
  // Prendre seulement les 6 projets les plus récents (non archivés)
  const activeProjects = projects.filter(p => p.statut !== 'Archive');
  const recentProjects = activeProjects.slice(0, 6);

  // Mapper les statuts de la BDD aux affichages
  const getStatusDisplay = (statut: string) => {
    const statusMap: any = {
      'En_cours': { label: 'En cours', color: 'bg-green-100 text-green-700 border-green-200' },
      'Termine': { label: 'Terminé', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      'En_attente': { label: 'Brouillon', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      'Archive': { label: 'Archivé', color: 'bg-gray-100 text-gray-700 border-gray-200' }
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header avec gradient subtil */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#1e3a8a] mb-2">Tableau de bord</h2>
            <p className="text-gray-600">Bienvenue ! Voici un aperçu de vos projets récents</p>
          </div>
          <button 
            onClick={onCreateProject} 
            className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            Nouveau projet
          </button>
        </div>
      </div>

      {/* Statistics Cards avec animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FolderOpen className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total de projets</p>
          <p className="text-4xl font-bold mb-2">{stats.projetsTotal}</p>
          <p className="text-xs opacity-75">Tous statuts confondus</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="bg-white/20 px-2 py-1 rounded text-xs">Actif</div>
          </div>
          <p className="text-sm opacity-90 mb-1">Projets en cours</p>
          <p className="text-4xl font-bold mb-2">{stats.projetsActifs}</p>
          <p className="text-xs opacity-75">En cours de réalisation</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="bg-white/20 px-2 py-1 rounded text-xs">Terminé</div>
          </div>
          <p className="text-sm opacity-90 mb-1">Projets terminés</p>
          <p className="text-4xl font-bold mb-2">{stats.projetsTermines}</p>
          <p className="text-xs opacity-75">Finalisés avec succès</p>
        </div>
      </div>

      {/* Section Projets Récents */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Projets récents</h3>
          {recentProjects.length > 0 && (
            <span className="text-sm text-gray-500">{recentProjects.length} projets actifs</span>
          )}
        </div>

        {/* Projects Grid */}
        {recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {recentProjects.map((project) => {
              const status = getStatusDisplay(project.statut);
              return (
                <div 
                  key={project.idProjet} 
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
                  onClick={() => onOpenProject(project.idProjet)}
                >
                  {/* Card Header avec couleur de statut */}
                  <div className={`h-2 ${status.color.includes('green') ? 'bg-green-500' : status.color.includes('blue') ? 'bg-blue-500' : status.color.includes('yellow') ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 mb-1 truncate group-hover:text-[#1e3a8a] transition-colors">
                          {project.nom}
                        </h3>
                        <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.client || 'Sans client'}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 space-y-2">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Créé le {formatDate(project.dateCreation)}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                          {status.label}
                        </span>
                        {project.plansCount > 0 && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {project.plansCount} plan{project.plansCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProject(project.idProjet);
                        }}
                        className="flex-1 bg-[#1e3a8a] text-white px-4 py-2.5 rounded-lg hover:bg-[#1e40af] transition-all font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Ouvrir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun projet</h3>
              <p className="text-gray-500 mb-6">Commencez par créer votre premier projet</p>
              <button 
                onClick={onCreateProject} 
                className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Créer mon premier projet
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section informative */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="bg-blue-500 p-3 rounded-lg text-white">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-2">Productivité en hausse</h4>
            <p className="text-sm text-gray-600">
              {stats.projetsActifs > 0 ? (
                <>Votre équipe gère actuellement <strong>{stats.projetsActifs} projet{stats.projetsActifs > 1 ? 's' : ''} actif{stats.projetsActifs > 1 ? 's' : ''}</strong>. Continuez sur cette lancée pour atteindre vos objectifs !</>
              ) : (
                <>Aucun projet actif pour le moment. Créez votre premier projet pour commencer !</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}