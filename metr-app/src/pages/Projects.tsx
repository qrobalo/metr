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
  const getStatusColor = (statut: string) => {
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
    const matchesSearch = project.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.client && project.client.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || project.statut === statusFilter;
    const matchesArchived = showArchived || project.statut !== 'Archive';
    
    return matchesSearch && matchesStatus && matchesArchived;
  });

  // Calculer les statistiques
  const stats = {
    total: projects.length,
    actifs: projects.filter(p => p.statut !== 'Archive').length,
    archives: projects.filter(p => p.statut === 'Archive').length
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-primary-900">Mes projets</h2>
        <button onClick={onCreateProject} className="btn-secondary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Créer un nouveau projet
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un projet ou un client..."
              className="input-field pl-10"
            />
          </div>

          {/* Filter Dropdowns */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="all">Tous les statuts</option>
            <option value="En_cours">En cours</option>
            <option value="Termine">Terminé</option>
            <option value="En_attente">Brouillon</option>
            <option value="Archive">Archivé</option>
          </select>

          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Show Archived Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Afficher aussi les projets archivés</span>
        </label>

        {/* Sort */}
        <div className="flex items-center gap-2 mt-4 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Trier par :</span>
          <button className="flex items-center gap-1 text-gray-700 font-medium">
            Dernière modification
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProjects.map((project) => {
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
        <div className="card text-center py-12 mb-8">
          <p className="text-gray-500">Aucun projet trouvé</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-2">Nombre total de projets</p>
          <p className="text-4xl font-bold text-primary-900">{stats.total}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-2">Projets actifs</p>
          <p className="text-4xl font-bold text-primary-900">{stats.actifs}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-2">Projets archivés</p>
          <p className="text-4xl font-bold text-primary-900">{stats.archives}</p>
        </div>
      </div>
    </div>
  );
}