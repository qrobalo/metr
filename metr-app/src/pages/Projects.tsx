import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, ExternalLink, MoreVertical, SlidersHorizontal, ChevronDown, Edit, Archive, Trash2, CheckCircle, Calendar, Users } from 'lucide-react';
import { projectAPI } from '../services/api';

interface ProjectsProps {
  projects: any[];
  onCreateProject: () => void;
  onOpenProject: (id: number) => void;
  onProjectsChange: () => void;
}

export default function Projects({ projects, onCreateProject, onOpenProject, onProjectsChange }: ProjectsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Fermer les menus au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusDisplay = (statut: string) => {
    const statusMap: any = {
      'En_cours': { label: 'En cours', color: 'bg-green-100 text-green-700' },
      'Termine': { label: 'Terminé', color: 'bg-blue-100 text-blue-700' },
      'En_attente': { label: 'Brouillon', color: 'bg-yellow-100 text-yellow-700' },
      'Archive': { label: 'Archivé', color: 'bg-gray-100 text-gray-700' }
    };
    return statusMap[statut] || statusMap['En_attente'];
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.client && project.client.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || project.statut === statusFilter;
    const matchesArchived = showArchived || project.statut !== 'Archive';
    
    return matchesSearch && matchesStatus && matchesArchived;
  });

  // Tri des projets
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.nom.localeCompare(b.nom);
      case 'client':
        return (a.client || '').localeCompare(b.client || '');
      case 'status':
        return a.statut.localeCompare(b.statut);
      case 'date':
      default:
        return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
    }
  });

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

  // ============= FONCTIONS DE MODIFICATION =============
  
  const handleChangeStatus = async (projectId: number, newStatus: string, projectName: string) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    setOpenMenuId(null);

    try {
      await projectAPI.updateProject(projectId, { statut: newStatus });
      await onProjectsChange(); // Recharger les projets
      
      const statusLabels: any = {
        'En_cours': 'en cours',
        'Termine': 'terminé',
        'En_attente': 'brouillon',
        'Archive': 'archivé'
      };
      
      alert(`✓ Projet "${projectName}" marqué comme ${statusLabels[newStatus]}`);
    } catch (error: any) {
      alert(`❌ Erreur: ${error.message || 'Impossible de modifier le projet'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleArchiveProject = async (projectId: number, projectName: string) => {
    if (isUpdating) return;
    
    if (!confirm(`Archiver le projet "${projectName}" ?`)) return;
    
    setIsUpdating(true);
    setOpenMenuId(null);

    try {
      await projectAPI.updateProject(projectId, { statut: 'Archive' });
      await onProjectsChange();
      alert(`✓ Projet "${projectName}" archivé avec succès`);
    } catch (error: any) {
      alert(`❌ Erreur: ${error.message || 'Impossible d\'archiver le projet'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProject = async (projectId: number, projectName: string) => {
    if (isUpdating) return;
    
    if (!confirm(`⚠️ ATTENTION\n\nSupprimer définitivement "${projectName}" ?\n\nCette action est irréversible.`)) return;
    
    setIsUpdating(true);
    setOpenMenuId(null);

    try {
      await projectAPI.deleteProject(projectId);
      await onProjectsChange();
      alert(`✓ Projet "${projectName}" supprimé`);
    } catch (error: any) {
      alert(`❌ Erreur: ${error.message || 'Impossible de supprimer le projet'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const sortOptions = [
    { value: 'date', label: 'Dernière modification' },
    { value: 'name', label: 'Nom (A-Z)' },
    { value: 'client', label: 'Client (A-Z)' },
    { value: 'status', label: 'Statut' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#1e3a8a]">Mes projets</h2>
        <button 
          onClick={onCreateProject} 
          className="bg-[#f97316] text-white px-6 py-3 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Créer un nouveau projet
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-5 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un projet ou un client..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
            />
          </div>

          {/* Filters */}
          <div className="lg:col-span-7 flex gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="En_cours">En cours</option>
              <option value="Termine">Terminé</option>
              <option value="En_attente">Brouillon</option>
              <option value="Archive">Archivé</option>
            </select>

            <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Checkbox et tri */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
            />
            <span className="text-sm text-gray-700">Afficher les projets archivés</span>
          </label>

          {/* Sort */}
          <div className="flex items-center gap-2 text-sm" ref={sortRef}>
            <span className="text-gray-600">Trier par :</span>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-700 font-medium hover:text-[#1e3a8a] hover:bg-gray-50 rounded-lg transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {sortOptions.find(opt => opt.value === sortBy)?.label}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showSortMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[200px] z-50">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        sortBy === option.value ? 'text-[#1e3a8a] font-medium bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {sortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sortedProjects.map((project) => {
            const status = getStatusDisplay(project.statut);
            return (
              <div 
                key={project.idProjet} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                      {project.nom}
                    </h3>
                    <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {project.client || 'Sans client'}
                    </p>
                  </div>
                  
                  {/* Menu 3 points - FONCTIONNEL */}
                  <div className="relative ml-2" ref={openMenuId === project.idProjet ? menuRef : null}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === project.idProjet ? null : project.idProjet);
                      }}
                      disabled={isUpdating}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    {openMenuId === project.idProjet && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[180px] z-50">
                        {project.statut !== 'En_cours' && (
                          <button
                            onClick={() => handleChangeStatus(project.idProjet, 'En_cours', project.nom)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                          >
                            <Edit className="w-4 h-4" />
                            Marquer en cours
                          </button>
                        )}
                        {project.statut !== 'Termine' && (
                          <button
                            onClick={() => handleChangeStatus(project.idProjet, 'Termine', project.nom)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Marquer terminé
                          </button>
                        )}
                        {project.statut !== 'Archive' && (
                          <button
                            onClick={() => handleArchiveProject(project.idProjet, project.nom)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                          >
                            <Archive className="w-4 h-4" />
                            Archiver
                          </button>
                        )}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={() => handleDeleteProject(project.idProjet, project.nom)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Créé le {formatDate(project.dateCreation)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
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
                    onClick={() => onOpenProject(project.idProjet)}
                    className="flex-1 bg-[#1e3a8a] text-white px-4 py-2.5 rounded-lg hover:bg-[#1e40af] transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ouvrir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center mb-8">
          <p className="text-gray-500 text-lg mb-2">Aucun projet trouvé</p>
          {searchQuery && (
            <p className="text-gray-400 text-sm">
              Essayez de modifier vos critères de recherche
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-5 text-white">
          <p className="text-sm opacity-90 mb-1">Total de projets</p>
          <p className="text-4xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-5 text-white">
          <p className="text-sm opacity-90 mb-1">Projets actifs</p>
          <p className="text-4xl font-bold">{stats.actifs}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg shadow-md p-5 text-white">
          <p className="text-sm opacity-90 mb-1">Projets archivés</p>
          <p className="text-4xl font-bold">{stats.archives}</p>
        </div>
      </div>

      {/* Loading overlay */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1e3a8a]"></div>
              <p className="text-gray-700 font-medium">Mise à jour en cours...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}