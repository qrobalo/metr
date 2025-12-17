import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, ExternalLink, MoreVertical, SlidersHorizontal, ChevronDown, Edit, Archive, Trash2, CheckCircle } from 'lucide-react';
import { projectAPI } from '../services/api';

interface Project {
  idProjet: number;
  nom: string;
  client?: string;
  statut: string;
  dateCreation: string;
}

interface ProjectsProps {
  projects: Project[];
  onCreateProject: () => void;
  onOpenProject: (id: number) => void;
  onProjectsChange: () => void;
}

export default function Projects({ projects: initialProjects, onCreateProject, onOpenProject, onProjectsChange }: ProjectsProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

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

  // Extraire les années disponibles des projets
  const availableYears = Array.from(new Set(
    projects.map(p => new Date(p.dateCreation).getFullYear())
  )).sort((a, b) => b - a);

  const getStatusDisplay = (statut: string) => {
    const statusMap: any = {
      'En_cours': { label: 'En cours', color: 'bg-[#22C55E] text-white', textColor: 'text-[#22C55E]' },
      'Termine': { label: 'Terminé', color: 'bg-[#3B82F6] text-white', textColor: 'text-[#3B82F6]' },
      'En_attente': { label: 'Brouillon', color: 'bg-[#F59E0B] text-white', textColor: 'text-[#F59E0B]' },
      'Archive': { label: 'Archivé', color: 'bg-gray-400 text-white', textColor: 'text-gray-400' }
    };
    return statusMap[statut] || statusMap['En_attente'];
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.client && project.client.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || project.statut === statusFilter;
    const matchesArchived = statusFilter === 'Archive' || showArchived || project.statut !== 'Archive';
    
    const projectYear = new Date(project.dateCreation).getFullYear();
    const matchesYear = yearFilter === 'all' || projectYear === parseInt(yearFilter);
    
    return matchesSearch && matchesStatus && matchesArchived && matchesYear;
  });

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
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `Créé le ${day}/${month}/${year}`;
  };

  const handleChangeStatus = async (projectId: number, newStatus: string, projectName: string) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    setOpenMenuId(null);

    try {
      // Appel API pour mettre à jour le statut
      await projectAPI.updateProject(projectId, { statut: newStatus });
      
      // Recharger les projets depuis le serveur pour avoir les données à jour
      await onProjectsChange();
      
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
      // Appel API pour archiver
      await projectAPI.updateProject(projectId, { statut: 'Archive' });
      
      // Recharger les projets depuis le serveur
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
      // Appel API pour supprimer
      await projectAPI.deleteProject(projectId);
      
      // Recharger les projets depuis le serveur
      await onProjectsChange();
      
      alert(`✓ Projet "${projectName}" supprimé`);
    } catch (error: any) {
      alert(`❌ Erreur: ${error.message || 'Impossible de supprimer le projet'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative">
      <div className={`p-8 max-w-[1400px] mx-auto transition-all duration-300 ${isUpdating ? 'blur-sm' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#1E293B]">Mes projets</h1>
          <button 
            onClick={onCreateProject} 
            className="bg-[#F97316] text-white px-6 py-2.5 rounded-lg hover:bg-[#EA580C] transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Créer un nouveau projet
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un projet ou un client..."
              className="w-full max-w-sm pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-sm"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Filtre par statut */}
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              >
                <option value="all">Tous les statuts</option>
                <option value="En_cours">En cours</option>
                <option value="Termine">Terminé</option>
                <option value="En_attente">Brouillon</option>
                <option value="Archive">Archivé</option>
              </select>

              {/* Filtre par année */}
              <select 
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              >
                <option value="all">Toutes les années</option>
                {availableYears.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>

              {/* Checkbox pour afficher les archivés */}
              {statusFilter !== 'Archive' && (
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#475569]">
                  <input
                    type="checkbox"
                    checked={showArchived}
                    onChange={(e) => setShowArchived(e.target.checked)}
                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                  Afficher aussi les projets archivés
                </label>
              )}
            </div>

            {/* Menu de tri */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#64748B]" />
                <span className="text-sm text-[#475569]">Trier par :</span>
                <span className="text-sm text-[#0F172A] font-medium">
                  {sortBy === 'date' ? 'Dernière modification' : 
                   sortBy === 'name' ? 'Nom (A-Z)' : 
                   sortBy === 'client' ? 'Client (A-Z)' : 'Statut'}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
              </button>

              {showSortMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1 min-w-[200px] z-50">
                  {[
                    { value: 'date', label: 'Dernière modification' },
                    { value: 'name', label: 'Nom (A-Z)' },
                    { value: 'client', label: 'Client (A-Z)' },
                    { value: 'status', label: 'Statut' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F8FAFC] ${
                        sortBy === option.value ? 'text-[#3B82F6] font-medium' : 'text-[#475569]'
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

        {/* Projects Grid */}
        {sortedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sortedProjects.map((project) => {
              const status = getStatusDisplay(project.statut);
              return (
                <div 
                  key={project.idProjet} 
                  className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  <div className="p-6">
                    {/* Header with Menu */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#0F172A] mb-1">
                          {project.nom}
                        </h3>
                        <p className="text-sm text-[#64748B]">
                          {project.client || 'Sans client'}
                        </p>
                      </div>
                      
                      <div className="relative" ref={openMenuId === project.idProjet ? menuRef : null}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === project.idProjet ? null : project.idProjet);
                          }}
                          disabled={isUpdating}
                          className="p-1 hover:bg-[#F1F5F9] rounded transition-colors disabled:opacity-50 bg-transparent border-0 p-0 m-0"
                        >
                          <MoreVertical className="w-5 h-5 text-[#94A3B8]" />
                        </button>
                        
                        {openMenuId === project.idProjet && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-xl py-1 min-w-[180px] z-50 ">
                            {project.statut !== 'En_cours' && (
                              <button
                                onClick={() => handleChangeStatus(project.idProjet, 'En_cours', project.nom)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-[#F8FAFC] flex items-center gap-2 text-[#475569] bg-transparent border-0 p-0 m-0"
                              >
                                <Edit className="w-4 h-4" />
                                Marquer en cours
                              </button>
                            )}
                            {project.statut !== 'Termine' && (
                              <button
                                onClick={() => handleChangeStatus(project.idProjet, 'Termine', project.nom)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-[#F8FAFC] flex items-center gap-2 text-[#475569] bg-transparent border-0 p-0 m-0"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Marquer terminé
                              </button>
                            )}
                            {project.statut !== 'Archive' && (
                              <button
                                onClick={() => handleArchiveProject(project.idProjet, project.nom)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-[#F8FAFC] flex items-center gap-2 text-[#475569] bg-transparent border-0 p-0 m-0"
                              >
                                <Archive className="w-4 h-4" />
                                Archiver
                              </button>
                            )}
                            <div className="border-t border-[#E2E8F0] my-1"></div>
                            <button
                              onClick={() => handleDeleteProject(project.idProjet, project.nom)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 bg-transparent border-0 p-0 m-0"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <p className="text-xs text-[#64748B] mb-4">
                      {formatDate(project.dateCreation)}
                    </p>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onOpenProject(project.idProjet)}
                        className="flex-1 bg-[#1E40AF] text-white px-4 py-2 rounded-lg hover:bg-[#1E3A8A] transition-colors text-sm font-medium flex items-center justify-center gap-2 "
                      >
                        <ExternalLink className="w-4 h-4" />
                        Ouvrir
                      </button>
                      <button 
                        className="px-4 py-2 border border-[#E2E8F0] text-[#475569] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium"
                      >
                        Dossier
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
            <p className="text-[#64748B] text-lg mb-2">Aucun projet trouvé</p>
            {searchQuery && (
              <p className="text-[#94A3B8] text-sm">
                Essayez de modifier vos critères de recherche
              </p>
            )}
          </div>
        )}

        {/* Bottom Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 text-center">
            <p className="text-sm text-[#64748B] mb-1">Nombre total de projets</p>
            <p className="text-3xl font-bold text-[#0F172A]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 text-center">
            <p className="text-sm text-[#64748B] mb-1">Projets actifs</p>
            <p className="text-3xl font-bold text-[#0F172A]">{stats.actifs}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 text-center">
            <p className="text-sm text-[#64748B] mb-1">Projets archivés</p>
            <p className="text-3xl font-bold text-[#0F172A]">{stats.archives}</p>
          </div>
        </div>
      </div>

      {/* Loading Overlay avec effet de flou */}
      {isUpdating && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-6 shadow-2xl pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1E40AF]"></div>
              <p className="text-[#0F172A] font-medium">Mise à jour en cours...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}