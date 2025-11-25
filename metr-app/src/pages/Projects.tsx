import React, { useState } from 'react';
import { Plus, Search, ExternalLink, MoreVertical, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface ProjectsProps {
  projects: any[];
  onCreateProject: () => void;
  onOpenProject: (id: number) => void;
}

export default function Projects({ projects, onCreateProject, onOpenProject }: ProjectsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Mapper les statuts
  const getStatusDisplay = (statut: string) => {
    const statusMap: any = {
      'En_cours': { label: 'En cours', color: 'bg-green-100 text-green-700' },
      'Termine': { label: 'Terminé', color: 'bg-blue-100 text-blue-700' },
      'En_attente': { label: 'Brouillon', color: 'bg-yellow-100 text-yellow-700' },
      'Archive': { label: 'Archivé', color: 'bg-gray-100 text-gray-700' }
    };
    return statusMap[statut] || statusMap['En_attente'];
  };

  // Filtrer les projets
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.client && project.client.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || project.statut === statusFilter;
    const matchesArchived = showArchived || project.statut !== 'Archive';
    
    return matchesSearch && matchesStatus && matchesArchived;
  });

  // Statistiques
  const stats = {
    total: projects.length,
    actifs: projects.filter(p => p.statut !== 'Archive').length,
    archives: projects.filter(p => p.statut === 'Archive').length
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
        <h2 className="text-3xl font-bold text-[#1e3a8a]">Mes projets</h2>
        <button 
          onClick={onCreateProject} 
          className="bg-[#f97316] text-white px-6 py-3 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Créer un nouveau projet
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un projet ou un client..."
              className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all w-48"
          >
            <option value="all">Tous les statuts</option>
            <option value="En_cours">En cours</option>
            <option value="Termine">Terminé</option>
            <option value="En_attente">Brouillon</option>
            <option value="Archive">Archivé</option>
          </select>

          <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] w-32">
            <option>Tous</option>
          </select>

          <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] w-32">
            <option>Tous</option>
          </select>

          <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] w-48">
            <option>Toutes les unités</option>
          </select>

          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Show Archived Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
          />
          <span className="text-sm text-gray-700">Afficher aussi les projets archivés</span>
        </label>

        {/* Sort */}
        <div className="flex items-center gap-2 mt-4 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Trier par :</span>
          <button className="flex items-center gap-1 text-gray-700 font-medium hover:text-[#1e3a8a]">
            Dernière modification
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProjects.map((project) => {
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
                      {project.client || 'Sans client'}
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
        <div className="bg-white rounded-lg shadow-md p-12 text-center mb-8">
          <p className="text-gray-500 text-lg">Aucun projet trouvé</p>
          {searchQuery && (
            <p className="text-gray-400 text-sm mt-2">
              Essayez de modifier vos critères de recherche
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Nombre total de projets</p>
          <p className="text-5xl font-bold text-[#1e3a8a]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Projets actifs</p>
          <p className="text-5xl font-bold text-[#1e3a8a]">{stats.actifs}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Projets archivés</p>
          <p className="text-5xl font-bold text-[#1e3a8a]">{stats.archives}</p>
        </div>
      </div>
    </div>
  );
}